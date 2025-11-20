import { AppDataSource } from "../config/data-source";
import { Auth } from "../entities/Auth";
import { AuxiliarySystem } from "../entities/AuxiliarySystem";
import { TokenHashes, TokenUtil } from "../utils/Token.util";
import {
	comparePassword,
	hashPassword,
	isPasswordHashed,
} from "../utils/password.util";

export class AuthServiceError extends Error {
	statusCode: number;

	constructor(message: string, statusCode = 400) {
		super(message);
		this.name = "AuthServiceError";
		this.statusCode = statusCode;
	}
}

export type RegisterUserParams = {
	username: string;
	password: string;
	auxiliarySystemId: number;
};

export class AuthService {
	private repository = AppDataSource.getRepository(Auth);
	private auxiliaryRepository = AppDataSource.getRepository(AuxiliarySystem);

	private normalizeUsername(username: string) {
		return username.trim();
	}

	async validateCredentials(username: string, password: string) {
		const normalizedUsername = this.normalizeUsername(username);
		const user = await this.repository.findOne({
			where: { username: normalizedUsername },
			relations: ["auxiliarySystem"],
		});

		if (!user) {
			return null;
		}

		const passwordMatches = await comparePassword(password, user.password);
		if (!passwordMatches) {
			return null;
		}

		if (!user.auxiliarySystem) {
			throw new Error(
				"Authenticated user is not linked to an auxiliary system"
			);
		}

		if (!isPasswordHashed(user.password)) {
			user.password = await hashPassword(password);
			await this.repository.save(user);
		}

		return user;
	}

	generateTokenForUser(user: Auth) {
		if (!user.auxiliarySystem) {
			throw new Error("Cannot generate token without an auxiliary system");
		}

		return TokenUtil.generate(user.username, user.auxiliarySystem.id);
	}

	async findUserByTokenHashes({ usernameHash, auxiliaryHash }: TokenHashes) {
		const users = await this.repository.find({
			relations: ["auxiliarySystem"],
		});
		return (
			users.find((candidate) => {
				if (!candidate.auxiliarySystem) {
					return false;
				}
				const candidateUsernameHash = TokenUtil.hashIdentifier(
					candidate.username
				);
				const candidateAuxiliaryHash = TokenUtil.hashIdentifier(
					String(candidate.auxiliarySystem.id)
				);
				return (
					candidateUsernameHash === usernameHash &&
					candidateAuxiliaryHash === auxiliaryHash
				);
			}) || null
		);
	}

	async registerUser({
		username,
		password,
		auxiliarySystemId,
	}: RegisterUserParams) {
		const normalizedUsername = this.normalizeUsername(username);
		if (!normalizedUsername) {
			throw new AuthServiceError("Username is required");
		}

		if (!password) {
			throw new AuthServiceError("Password is required");
		}

		const existing = await this.repository.findOne({
			where: { username: normalizedUsername },
		});
		if (existing) {
			throw new AuthServiceError("Username already exists", 409);
		}

		const auxiliary = await this.auxiliaryRepository.findOneBy({
			id: auxiliarySystemId,
		});
		if (!auxiliary) {
			throw new AuthServiceError("Auxiliary system not found", 404);
		}

		const user = this.repository.create({
			username: normalizedUsername,
			password,
			auxiliarySystem: auxiliary,
		});

		const savedUser = await this.repository.save(user);
		const hydratedUser = await this.repository.findOne({
			where: { id: savedUser.id },
			relations: ["auxiliarySystem"],
		});

		if (!hydratedUser) {
			throw new AuthServiceError("Unable to load created user", 500);
		}

		return hydratedUser;
	}
}
