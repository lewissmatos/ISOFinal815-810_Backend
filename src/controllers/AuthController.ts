import type { Request, Response } from "express";
import { AuthService, AuthServiceError } from "../services/AuthService";
import { ApiResponse } from "../utils/ApiResponse.util";

export class AuthController {
	private authService = new AuthService();

	async login(req: Request, res: Response) {
		const { username, password } = req.body ?? {};
		const normalizedUsername =
			typeof username === "string" ? username.trim() : "";
		const rawPassword = typeof password === "string" ? password : "";

		if (!normalizedUsername || !rawPassword) {
			return ApiResponse.badRequest(res, "Username and password are required");
		}

		try {
			const user = await this.authService.validateCredentials(
				normalizedUsername,
				rawPassword
			);
			if (!user) {
				return ApiResponse.error(res, "Invalid credentials", 401);
			}

			const token = this.authService.generateTokenForUser(user);

			return ApiResponse.success(
				res,
				{
					token,
					auth: {
						username: user.username,
						auxiliarySystem: user.auxiliarySystem,
					},
				},
				"Authentication successful"
			);
		} catch (error) {
			console.error("Error during authentication:", error);
			return ApiResponse.error(res, "Error interno del servidor");
		}
	}

	async signup(req: Request, res: Response) {
		const { username, password, auxiliarySystemId } = req.body ?? {};
		const normalizedUsername =
			typeof username === "string" ? username.trim() : "";
		const rawPassword = typeof password === "string" ? password : "";
		const parsedAuxiliaryId =
			typeof auxiliarySystemId === "number"
				? auxiliarySystemId
				: Number(auxiliarySystemId);

		if (!normalizedUsername || !rawPassword) {
			return ApiResponse.badRequest(res, "Username and password are required");
		}

		if (!Number.isInteger(parsedAuxiliaryId) || parsedAuxiliaryId <= 0) {
			return ApiResponse.badRequest(
				res,
				"A valid auxiliarySystemId is required"
			);
		}

		try {
			const user = await this.authService.registerUser({
				username: normalizedUsername,
				password: rawPassword,
				auxiliarySystemId: parsedAuxiliaryId,
			});
			const token = this.authService.generateTokenForUser(user);

			return ApiResponse.created(
				res,
				{
					token,
					username: user.username,
					auxiliarySystemId: user.auxiliarySystem?.id ?? null,
				},
				"Account created successfully"
			);
		} catch (error) {
			if (error instanceof AuthServiceError) {
				return ApiResponse.error(res, error.message, error.statusCode);
			}
			console.error("Error during signup:", error);
			return ApiResponse.error(res, "Error interno del servidor");
		}
	}
}
