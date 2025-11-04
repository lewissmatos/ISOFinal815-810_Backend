import type { Request, Response } from "express";
import { AppDataSource } from "../config/data-source.ts";
import { AccountingEntry } from "../entities/AccountingEntry.ts";
import { ApiResponse } from "../utils/ApiResponse.util.ts";

export class AccountingEntryController {
	private readonly repository = AppDataSource.getRepository(AccountingEntry);

	async getAll(req: Request, res: Response): Promise<Response> {
		try {
			const { calculationId, assetId, status, movementType, accountId } =
				req.query;

			const qb = this.repository
				.createQueryBuilder("entry")
				.leftJoinAndSelect("entry.account", "account")
				.leftJoinAndSelect("entry.inventoryType", "inventoryType")
				.leftJoinAndSelect("entry.depreciationCalculation", "calculation")
				.leftJoinAndSelect("calculation.asset", "asset")
				.orderBy("entry.entryDate", "DESC")
				.addOrderBy("entry.id", "DESC");

			if (calculationId) {
				const parsed = Number(calculationId);
				if (!Number.isInteger(parsed)) {
					return ApiResponse.badRequest(
						res,
						"El parámetro calculationId debe ser un número válido"
					);
				}
				qb.andWhere("calculation.id = :calculationId", {
					calculationId: parsed,
				});
			}

			if (assetId) {
				const parsed = Number(assetId);
				if (!Number.isInteger(parsed)) {
					return ApiResponse.badRequest(
						res,
						"El parámetro assetId debe ser un número válido"
					);
				}
				qb.andWhere("asset.id = :assetId", { assetId: parsed });
			}

			if (status) {
				const allowed = ["PENDIENTE", "PROCESADO", "ANULADO"] as const;
				const statuses = Array.isArray(status) ? status : [status];
				if (!statuses.every((value) => allowed.includes(value as any))) {
					return ApiResponse.badRequest(
						res,
						"El parámetro status contiene valores no válidos"
					);
				}
				qb.andWhere("entry.status IN (:...statuses)", {
					statuses: statuses as string[],
				});
			}

			if (movementType) {
				const allowed = ["DB", "CR"] as const;
				const movements = Array.isArray(movementType)
					? movementType
					: [movementType];
				if (!movements.every((value) => allowed.includes(value as any))) {
					return ApiResponse.badRequest(
						res,
						"El parámetro movementType contiene valores no válidos"
					);
				}
				qb.andWhere("entry.movementType IN (:...movements)", {
					movements: movements as string[],
				});
			}

			if (accountId) {
				const values = Array.isArray(accountId) ? accountId : [accountId];
				const parsed = values.map((value) => Number(value));
				if (!parsed.every((value) => Number.isInteger(value))) {
					return ApiResponse.badRequest(
						res,
						"El parámetro accountId debe contener números válidos"
					);
				}
				qb.andWhere("account.id IN (:...accountIds)", {
					accountIds: parsed,
				});
			}

			const data = await qb.getMany();
			return ApiResponse.success(res, data);
		} catch (error) {
			console.error("Error al obtener asientos contables:", error);
			return ApiResponse.error(res, "Error interno del servidor");
		}
	}

	async getById(req: Request, res: Response): Promise<Response> {
		const { id } = req.params;
		const parsedId = Number(id);
		if (!Number.isInteger(parsedId)) {
			return ApiResponse.badRequest(
				res,
				"El identificador debe ser un número válido"
			);
		}

		try {
			const entry = await this.repository.findOne({
				where: { id: parsedId },
				relations: [
					"account",
					"inventoryType",
					"depreciationCalculation",
					"depreciationCalculation.asset",
				],
			});

			if (!entry) {
				return ApiResponse.notFound(res, "Asiento contable no encontrado");
			}

			return ApiResponse.success(res, entry);
		} catch (error) {
			console.error("Error al obtener asiento contable:", error);
			return ApiResponse.error(res, "Error interno del servidor");
		}
	}
}
