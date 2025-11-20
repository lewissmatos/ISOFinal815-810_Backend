import type { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AccountingEntry } from "../entities/AccountingEntry";
import { ApiResponse } from "../utils/ApiResponse.util";
import { BaseController } from "./BaseController";

export class AccountingEntryController extends BaseController<AccountingEntry> {
	constructor() {
		super(AppDataSource.getRepository(AccountingEntry));
	}

	async getAll(req: Request, res: Response) {
		try {
			const { qb, alias } = this.createListQueryBuilder();
			const searchTerm = this.getStringQueryParam(req.query.search);
			if (searchTerm) {
				this.applySearchFilter(qb, alias, searchTerm);
			}

			const description = this.getStringQueryParam(req.query.description);
			if (description) {
				qb.andWhere(`${alias}.description LIKE :description`, {
					description: `%${description}%`,
				});
			}

			const auxiliaryId =
				this.getNumberQueryParam(req.query.auxiliaryId) ??
				this.getNumberQueryParam(req.query.auxiliarySystemId);
			if (auxiliaryId) {
				qb.andWhere(`${alias}.auxiliaryId = :auxiliaryId`, { auxiliaryId });
			}

			const accountId = this.getNumberQueryParam(req.query.accountId);
			if (accountId) {
				qb.andWhere(`${alias}.accountId = :accountId`, { accountId });
			}

			const movementType = this.getStringQueryParam(
				req.query.movementType
			)?.toUpperCase();
			if (movementType && ["DB", "CR"].includes(movementType)) {
				qb.andWhere(`${alias}.movementType = :movementType`, { movementType });
			}

			const fromDate =
				this.getDateQueryParam(req.query.fromDate) ??
				this.getDateQueryParam(req.query.startDate);
			if (fromDate) {
				qb.andWhere(`${alias}.entryDate >= :fromDate`, {
					fromDate: this.formatDateForQuery(fromDate),
				});
			}

			const toDate =
				this.getDateQueryParam(req.query.toDate) ??
				this.getDateQueryParam(req.query.endDate);
			if (toDate) {
				qb.andWhere(`${alias}.entryDate <= :toDate`, {
					toDate: this.formatDateForQuery(toDate),
				});
			}

			const exactDate = this.getDateQueryParam(req.query.entryDate);
			if (exactDate) {
				qb.andWhere(`${alias}.entryDate = :entryDate`, {
					entryDate: this.formatDateForQuery(exactDate),
				});
			}

			const items = (await qb.getMany()).sort((a, b) =>
				b.entryDate.toString().localeCompare(a.entryDate.toString())
			);
			return ApiResponse.success(
				res,
				items,
				"Accounting entries retrieved successfully"
			);
		} catch (error) {
			console.error("Error retrieving accounting entries:", error);
			const response = ApiResponse.error(res, "Error interno del servidor");
			return res.status(500).json(response);
		}
	}

	protected override getRelations(): string[] {
		return ["account", "auxiliary"];
	}

	private formatDateForQuery(date: Date) {
		return date.toISOString().slice(0, 10);
	}

	async create(req: Request, res: Response) {
		try {
			const payload = { ...req.body };
			const bodyAuxiliaryId = this.normalizeIdValue(
				payload?.auxiliary?.id ?? payload?.auxiliaryId
			);
			const resolvedAuxiliaryId =
				bodyAuxiliaryId ??
				this.normalizeIdValue(req.authContext?.auxiliarySystemId);

			if (!resolvedAuxiliaryId) {
				return ApiResponse.badRequest(
					res,
					"Auxiliary system is required to create an accounting entry"
				);
			}

			if (payload.auxiliary && typeof payload.auxiliary === "object") {
				payload.auxiliary = {
					...payload.auxiliary,
					id: resolvedAuxiliaryId,
				};
			} else {
				payload.auxiliary = { id: resolvedAuxiliaryId };
			}
			delete payload.auxiliaryId;

			const resolvedAccountId = this.normalizeIdValue(
				payload?.account?.id ?? payload?.accountId
			);
			if (!resolvedAccountId) {
				return ApiResponse.badRequest(
					res,
					"Account is required to create an accounting entry"
				);
			}

			payload.account = { id: resolvedAccountId };
			delete payload.accountId;

			const normalizedAmount = this.normalizeDecimalValue(payload.amount);
			if (normalizedAmount === null) {
				return ApiResponse.badRequest(
					res,
					"A valid amount is required to create an accounting entry"
				);
			}
			payload.amount = normalizedAmount;

			const item = this.repository.create(payload);
			const savedItem = await this.repository.save(item);
			return res.status(201).json(savedItem);
		} catch (error) {
			console.error("Error creating accounting entry:", error);
			const response = ApiResponse.error(res, "Error interno del servidor");
			return res.status(500).json(response);
		}
	}

	private normalizeIdValue(value: unknown): number | null {
		if (typeof value === "number") {
			return Number.isFinite(value) && value > 0 ? value : null;
		}
		if (typeof value === "string") {
			const trimmed = value.trim();
			if (!trimmed) {
				return null;
			}
			const parsed = Number(trimmed);
			return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
		}
		return null;
	}

	private normalizeDecimalValue(value: unknown): number | null {
		if (typeof value === "number" && Number.isFinite(value)) {
			return value;
		}
		if (typeof value === "string") {
			const trimmed = value.trim();
			if (!trimmed) {
				return null;
			}
			const parsed = Number(trimmed);
			return Number.isFinite(parsed) ? parsed : null;
		}
		return null;
	}
}
