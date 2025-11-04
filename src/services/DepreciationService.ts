import { AppDataSource } from "../config/data-source.ts";
import { FixedAsset } from "../entities/FixedAsset.ts";
import { DepreciationCalculation } from "../entities/DepreciationCalculation.ts";
import { AccountingEntry } from "../entities/AccountingEntry.ts";
import type { EntityManager } from "typeorm";

export class DepreciationError extends Error {
	statusCode: number;

	constructor(statusCode: number, message: string) {
		super(message);
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, DepreciationError.prototype);
	}
}

export interface AccountingEntrySummary {
	id: number;
	accountId: number;
	movementType: "DB" | "CR";
	amount: number;
	description: string;
	status: "PENDIENTE" | "PROCESADO" | "ANULADO";
	entryDate: Date;
}

export interface ProcessedAssetSummary {
	assetId: number;
	assetDescription: string;
	usefulLifeMonths: number;
	processYear: number;
	processMonth: number;
	depreciatedAmount: number;
	accumulatedDepreciation: number;
	calculationId: number;
	entries: AccountingEntrySummary[];
}

export interface SkippedAssetSummary {
	assetId: number;
	assetDescription: string;
	reason: string;
}

export interface ProcessAllResponse {
	processed: ProcessedAssetSummary[];
	skipped: SkippedAssetSummary[];
}

export type ProcessSingleResponse =
	| ({ processed: true } & ProcessedAssetSummary)
	| {
			processed: false;
			assetId: number;
			assetDescription: string;
			reason: string;
	  };

interface ApplyDepreciationParams {
	asset: FixedAsset;
	manager: EntityManager;
	processDate: Date;
	processYear: number;
	processMonth: number;
}

export class DepreciationService {
	private readonly calculationRepository = AppDataSource.getRepository(
		DepreciationCalculation
	);

	async processAllAssets(): Promise<ProcessAllResponse> {
		return AppDataSource.transaction(async (manager) => {
			const assets = await manager.find(FixedAsset, {
				where: { isActive: true },
				relations: [
					"typeOfAsset",
					"typeOfAsset.purchaseAccount",
					"typeOfAsset.depreciationAccount",
				],
			});

			if (!assets.length) {
				return { processed: [], skipped: [] };
			}

			const invalidAsset = assets.find(
				(asset) => !this.hasValidDepreciationData(asset)
			);
			if (invalidAsset) {
				throw new DepreciationError(
					400,
					`El activo ${invalidAsset.description} no cuenta con datos válidos para depreciación.`
				);
			}

			const processDate = new Date();
			const processYear = processDate.getFullYear();
			const processMonth = processDate.getMonth() + 1;

			const processed: ProcessedAssetSummary[] = [];
			const skipped: SkippedAssetSummary[] = [];

			for (const asset of assets) {
				const result = await this.applyDepreciation({
					asset,
					manager,
					processDate,
					processYear,
					processMonth,
				});

				if (result === null) {
					skipped.push({
						assetId: asset.id,
						assetDescription: asset.description,
						reason: "El activo ya completó su vida útil.",
					});
					continue;
				}

				processed.push(result);
			}

			return { processed, skipped };
		});
	}

	async processAssetById(assetId: number): Promise<ProcessSingleResponse> {
		return AppDataSource.transaction(async (manager) => {
			const asset = await manager.findOne(FixedAsset, {
				where: { id: assetId },
				relations: [
					"typeOfAsset",
					"typeOfAsset.purchaseAccount",
					"typeOfAsset.depreciationAccount",
				],
			});

			if (!asset) {
				throw new DepreciationError(404, "Activo fijo no encontrado");
			}

			if (!asset.isActive) {
				throw new DepreciationError(
					400,
					`El activo ${asset.id} no está activo y no puede depreciarse.`
				);
			}

			if (!this.hasValidDepreciationData(asset)) {
				throw new DepreciationError(
					400,
					`El activo ${asset.id} no cuenta con datos válidos para depreciación.`
				);
			}

			const processDate = new Date();
			const processYear = processDate.getFullYear();
			const processMonth = processDate.getMonth() + 1;

			const result = await this.applyDepreciation({
				asset,
				manager,
				processDate,
				processYear,
				processMonth,
			});

			if (result === null) {
				return {
					processed: false,
					assetId: asset.id,
					assetDescription: asset.description,
					reason: "El activo ya completó su vida útil.",
				};
			}

			return {
				processed: true,
				...result,
			};
		});
	}

	async listCalculations() {
		return this.calculationRepository.find({
			relations: [
				"asset",
				"asset.typeOfAsset",
				"purchaseAccount",
				"depreciationAccount",
				"accountingEntries",
				"accountingEntries.account",
			],
			order: { processDate: "DESC" },
		});
	}

	async getCalculationById(id: number) {
		const calculation = await this.calculationRepository.findOne({
			where: { id },
			relations: [
				"asset",
				"asset.typeOfAsset",
				"purchaseAccount",
				"depreciationAccount",
				"accountingEntries",
				"accountingEntries.account",
			],
		});

		if (!calculation) {
			throw new DepreciationError(404, "Cálculo de depreciación no encontrado");
		}

		return calculation;
	}

	private hasValidDepreciationData(asset: FixedAsset): boolean {
		const purchaseValue = this.toNumber(asset.purchaseValue);

		return (
			asset.usefulLifeMonths > 0 &&
			purchaseValue > 0 &&
			Boolean(asset.typeOfAsset?.purchaseAccount) &&
			Boolean(asset.typeOfAsset?.depreciationAccount)
		);
	}

	private toNumber(value: unknown): number {
		if (typeof value === "number") {
			return value;
		}

		const parsed = Number(value);
		return Number.isNaN(parsed) ? 0 : parsed;
	}

	private round(value: number): number {
		return Math.round((value + Number.EPSILON) * 100) / 100;
	}

	private async applyDepreciation({
		asset,
		manager,
		processDate,
		processYear,
		processMonth,
	}: ApplyDepreciationParams): Promise<ProcessedAssetSummary | null> {
		const purchaseValue = this.toNumber(asset.purchaseValue);
		const accumulated = this.toNumber(asset.accumulatedDepreciation);
		const remaining = this.round(purchaseValue - accumulated);

		if (remaining <= 0) {
			return null;
		}

		const monthlyBase = purchaseValue / asset.usefulLifeMonths;
		const preliminaryAmount = Math.min(monthlyBase, remaining);
		const depreciationAmount = this.round(preliminaryAmount);

		if (depreciationAmount <= 0) {
			return null;
		}

		const newAccumulated = this.round(
			Math.min(purchaseValue, accumulated + depreciationAmount)
		);

		asset.accumulatedDepreciation = newAccumulated;
		const updatedAsset = await manager.save(FixedAsset, asset);

		const purchaseAccount = asset.typeOfAsset?.purchaseAccount;
		const depreciationAccount = asset.typeOfAsset?.depreciationAccount;

		if (!purchaseAccount || !depreciationAccount) {
			throw new DepreciationError(
				400,
				`El tipo de activo ${asset.typeOfAsset?.id} no tiene cuentas contables asociadas.`
			);
		}

		const calculation = manager.create(DepreciationCalculation, {
			processYear,
			processMonth,
			asset: updatedAsset,
			processDate,
			depreciatedAmount: depreciationAmount,
			accumulatedDepreciation: newAccumulated,
			purchaseAccount,
			depreciationAccount,
		});

		const savedCalculation = await manager.save(
			DepreciationCalculation,
			calculation
		);

		const monthLabel = processMonth.toString().padStart(2, "0");
		const baseDescription = `Depreciación ${asset.description} ${monthLabel}/${processYear}`;

		const debitEntry = manager.create(AccountingEntry, {
			description: `${baseDescription} - DB`,
			inventoryType: asset.typeOfAsset,
			account: purchaseAccount,
			movementType: "DB" as const,
			entryDate: processDate,
			amount: depreciationAmount,
			status: "PROCESADO" as const,
			depreciationCalculation: savedCalculation,
		});

		const creditEntry = manager.create(AccountingEntry, {
			description: `${baseDescription} - CR`,
			inventoryType: asset.typeOfAsset,
			account: depreciationAccount,
			movementType: "CR" as const,
			entryDate: processDate,
			amount: depreciationAmount,
			status: "PROCESADO" as const,
			depreciationCalculation: savedCalculation,
		});

		const savedEntries = await manager.save(AccountingEntry, [
			debitEntry,
			creditEntry,
		]);

		return {
			assetId: asset.id,
			assetDescription: asset.description,
			usefulLifeMonths: asset.usefulLifeMonths,
			processYear,
			processMonth,
			depreciatedAmount: depreciationAmount,
			accumulatedDepreciation: newAccumulated,
			calculationId: savedCalculation.id,
			entries: savedEntries.map((entry) => ({
				id: entry.id,
				accountId: entry.account.id,
				movementType: entry.movementType,
				amount: entry.amount,
				description: entry.description,
				status: entry.status,
				entryDate: entry.entryDate,
			})),
		};
	}
}
