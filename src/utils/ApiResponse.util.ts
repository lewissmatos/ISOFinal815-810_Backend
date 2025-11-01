import type { Response } from "express";

export class ApiResponse {
	static success<T>(res: Response, data: T, message = "Request successful") {
		return res.status(200).json({
			isOk: true,
			message,
			data,
		});
	}

	static created<T>(
		res: Response,
		data: T,
		message = "Resource created successfully"
	) {
		return res.status(201).json({
			isOk: true,
			message,
			data,
		});
	}

	static error(res: Response, message = "An error occurred", statusCode = 500) {
		return res.status(statusCode).json({
			isOk: false,
			message,
			data: null,
		});
	}
	static notFound(res: Response, message = "Resource not found") {
		return res.status(404).json({
			isOk: false,
			message,
			data: null,
		});
	}

	static badRequest(res: Response, message = "Bad request") {
		return res.status(400).json({
			isOk: false,
			message,
			data: null,
		});
	}
}
