import crypto from "node:crypto";
import jwt, { type JwtPayload } from "jsonwebtoken";

export type TokenHashes = {
	usernameHash: string;
	auxiliaryHash: string;
};

type TokenPayload = TokenHashes & {
	nonce: string;
};

export class TokenUtil {
	private static getSecret() {
		const secret = process.env.AUTH_TOKEN_SECRET;
		if (!secret) {
			throw new Error(
				"AUTH_TOKEN_SECRET environment variable is not configured"
			);
		}
		return secret;
	}

	static hashIdentifier(value: string) {
		const secret = this.getSecret();
		return crypto
			.createHash("sha256")
			.update(`${value}:${secret}`)
			.digest("hex");
	}

	static generate(username: string, auxiliaryId: number) {
		const secret = this.getSecret();
		const payload: TokenPayload = {
			usernameHash: this.hashIdentifier(username),
			auxiliaryHash: this.hashIdentifier(String(auxiliaryId)),
			nonce: crypto.randomUUID(),
		};

		return jwt.sign(payload, secret, {
			algorithm: "HS256",
			noTimestamp: false,
		});
	}

	static verify(token: string): TokenHashes {
		const secret = this.getSecret();
		const decoded = jwt.verify(token, secret);
		const payload =
			typeof decoded === "string" ? null : (decoded as JwtPayload);
		if (!payload) {
			throw new Error("Invalid authentication token payload");
		}

		const usernameHash = payload.usernameHash;
		const auxiliaryHash = payload.auxiliaryHash;

		if (typeof usernameHash !== "string" || typeof auxiliaryHash !== "string") {
			throw new Error("Invalid authentication token payload");
		}

		return {
			usernameHash,
			auxiliaryHash,
		};
	}
}
