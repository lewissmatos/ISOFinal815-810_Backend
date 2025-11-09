import bcrypt from "bcryptjs";

const HASH_PREFIX = "$2";
const HASH_LENGTH = 60;
const DEFAULT_SALT_ROUNDS = 10;

const resolveSaltRounds = () => {
	const raw = process.env.AUTH_PASSWORD_SALT_ROUNDS;
	const parsed = raw ? Number(raw) : NaN;
	if (Number.isInteger(parsed) && parsed > 0) {
		return parsed;
	}
	return DEFAULT_SALT_ROUNDS;
};

export const isPasswordHashed = (value: string) =>
	typeof value === "string" &&
	value.startsWith(HASH_PREFIX) &&
	value.length === HASH_LENGTH;

export const hashPasswordSync = (password: string) =>
	bcrypt.hashSync(password, resolveSaltRounds());

export const hashPassword = (password: string) =>
	bcrypt.hash(password, resolveSaltRounds());

export const comparePassword = async (
	rawPassword: string,
	storedPassword: string
) => {
	if (!storedPassword) {
		return false;
	}

	if (!isPasswordHashed(storedPassword)) {
		return rawPassword === storedPassword;
	}

	return bcrypt.compare(rawPassword, storedPassword);
};
