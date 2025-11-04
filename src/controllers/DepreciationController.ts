import type { Request, Response } from "express";
import {
	DepreciationError,
	DepreciationService,
	ListCalculationsFilters,
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

	async list(req: Request, res: Response) {
		const { assetId, year, month } = req.query;
		const filters: ListCalculationsFilters = {};

		if (assetId !== undefined) {
			const value = Array.isArray(assetId) ? assetId[0] : assetId;
			const parsed = Number(value);
			if (!Number.isInteger(parsed) || parsed <= 0) {
				return ApiResponse.badRequest(
					res,
					"El parámetro assetId debe ser un número entero positivo"
				);
			}
			filters.assetId = parsed;
		}

		if (year !== undefined) {
			const value = Array.isArray(year) ? year[0] : year;
			const parsed = Number(value);
			if (!Number.isInteger(parsed) || parsed < 1900) {
				return ApiResponse.badRequest(
					res,
					"El parámetro year debe ser un número entero válido"
				);
			}
			filters.year = parsed;
		}

		if (month !== undefined) {
			const value = Array.isArray(month) ? month[0] : month;
			const parsed = Number(value);
			if (!Number.isInteger(parsed) || parsed < 1 || parsed > 12) {
				return ApiResponse.badRequest(
					res,
					"El parámetro month debe ser un número entre 1 y 12"
				);
			}
			filters.month = parsed;
		}

		try {
			const data = await this.depreciationService.listCalculations(filters);
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
