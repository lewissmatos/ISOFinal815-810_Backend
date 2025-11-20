import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.util";
import { AuthService } from "../services/AuthService";
import { TokenUtil } from "../utils/Token.util";

const authService = new AuthService();

export const authenticationMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authorization = req.headers.authorization;
	if (!authorization || !authorization.startsWith("Bearer ")) {
		return ApiResponse.error(res, "Authorization token is required", 401);
	}

	const token = authorization.replace("Bearer", "").trim();

	try {
		const hashes = TokenUtil.verify(token);
		const user = await authService.findUserByTokenHashes(hashes);

		if (!user || !user.auxiliarySystem) {
			return ApiResponse.error(res, "Invalid authentication token", 401);
		}

		req.authContext = {
			userId: user.id,
			username: user.username,
			auxiliarySystemId: user.auxiliarySystem.id,
			token,
			usernameHash: hashes.usernameHash,
			auxiliaryHash: hashes.auxiliaryHash,
		};

		next();
	} catch (error) {
		console.error("Authentication failure:", error);
		const isConfigError =
			error instanceof Error && error.message.includes("AUTH_TOKEN_SECRET");
		const statusCode = isConfigError ? 500 : 401;
		const message = isConfigError
			? "Error interno del servidor"
			: "Unauthorized";
		return ApiResponse.error(res, message, statusCode);
	}
};
