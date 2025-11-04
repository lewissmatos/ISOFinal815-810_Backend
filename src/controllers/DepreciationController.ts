import type { Request, Response } from "express";
import {
	DepreciationError,
	DepreciationService,
} from "../services/DepreciationService.ts";
import { ApiResponse } from "../utils/ApiResponse.util.ts";

export class DepreciationController {
	private readonly depreciationService = new DepreciationService();

	async processAll(_: Request, res: Response) {
		try {
			const result = await this.depreciationService.processAllAssets();
			const message = result.processed.length
				? "Depreciación procesada correctamente"
				: "No se generaron depreciaciones";
			return ApiResponse.success(res, result, message);
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async processSingle(req: Request, res: Response) {
		const assetId = Number(req.params.id);
		if (!Number.isInteger(assetId) || assetId <= 0) {
			return ApiResponse.badRequest(
				res,
				"El identificador del activo debe ser un número válido"
			);
		}

		try {
			const result = await this.depreciationService.processAssetById(assetId);
			const message = result.processed
				? "Depreciación procesada correctamente"
				: result.reason ?? "No se generó depreciación";
			return ApiResponse.success(res, result, message);
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async list(_: Request, res: Response) {
		try {
			const data = await this.depreciationService.listCalculations();
			return ApiResponse.success(res, data);
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async getById(req: Request, res: Response) {
		const calculationId = Number(req.params.id);
		if (!Number.isInteger(calculationId) || calculationId <= 0) {
			return ApiResponse.badRequest(
				res,
				"El identificador del cálculo debe ser un número válido"
			);
		}

		try {
			const calculation = await this.depreciationService.getCalculationById(
				calculationId
			);
			return ApiResponse.success(res, calculation);
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	private handleError(res: Response, error: unknown) {
		if (error instanceof DepreciationError) {
			return ApiResponse.error(res, error.message, error.statusCode);
		}

		console.error("Error en el módulo de depreciación:", error);
		return ApiResponse.error(res, "Error interno del servidor");
	}
}
