import { AppDataSource } from "../config/data-source";
import { BaseController } from "./BaseController";
import { Currency } from "../entities/Currency";
import type { Request, Response } from "express";

export class CurrencyController extends BaseController<Currency> {
	constructor() {
		super(AppDataSource.getRepository(Currency));
	}

	async syncRates(req: Request, res: Response) {
		const payload = Array.isArray(req.body) ? req.body : req.body?.currencies;
		if (!Array.isArray(payload) || payload.length === 0) {
			return res.status(400).json({
				isOk: false,
				message:
					"Debe enviar un arreglo de monedas con su código o id y la nueva tasa.",
			});
		}

		const queryRunner = AppDataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const updates: Array<{ id: number; code: string; rate: number }> = [];
		let failureDetails: { identifier: string; error: string } | null = null;

		try {
			for (const entry of payload) {
				const { id, code, ISOCode, rate } = entry ?? {};
				const numericRate = Number(rate);
				const identifierRaw = typeof id === "number" ? id : code ?? ISOCode;
				const identifier =
					identifierRaw !== undefined ? String(identifierRaw) : "desconocido";

				if (!Number.isFinite(numericRate)) {
					const message = "La tasa enviada no es válida";
					failureDetails = { identifier, error: message };
					throw new Error(message);
				}

				if (identifierRaw === undefined) {
					const message = "Cada moneda debe incluir un id o código";
					failureDetails = { identifier, error: message };
					throw new Error(message);
				}

				let currency: Currency | null;
				if (typeof id === "number") {
					currency = await queryRunner.manager.findOne(Currency, {
						where: { id },
					});
				} else {
					const isoCode = String(code ?? ISOCode).toUpperCase();
					currency = await queryRunner.manager.findOne(Currency, {
						where: { ISOCode: isoCode },
					});
				}

				if (!currency) {
					const message = `Moneda no encontrada (${identifier})`;
					failureDetails = { identifier, error: message };
					throw new Error(message);
				}

				currency.exchangeRate = numericRate;
				await queryRunner.manager.save(currency);
				updates.push({
					id: currency.id,
					code: currency.ISOCode,
					rate: numericRate,
				});
			}

			await queryRunner.commitTransaction();
			return res.status(200).json({
				isOk: true,
				message: "Tasas actualizadas",
				data: updates,
			});
		} catch (error) {
			await queryRunner.rollbackTransaction();
			console.error("Error updating rates:", error);
			return res.status(400).json({
				isOk: false,
				message: "No se pudieron actualizar las tasas",
				error: error instanceof Error ? error.message : String(error),
				failedCurrency: failureDetails,
			});
		} finally {
			await queryRunner.release();
		}
	}

	async syncRate(req: Request, res: Response) {
		try {
			const currency = await this.repository.findOneBy({
				id: Number(req.params.id),
			});
			if (!currency) {
				return res
					.status(404)
					.json({ isOk: false, message: "Currency not found" });
			}
			try {
				const { rate } = req.body ?? {};
				const numericRate = Number(rate);
				if (!Number.isFinite(numericRate)) {
					return res.status(400).json({
						isOk: false,
						message: "Debe enviar una tasa válida en el cuerpo de la solicitud",
					});
				}

				currency.exchangeRate = numericRate;
				await this.repository.save(currency);
				return res.status(200).json({
					isOk: true,
					message: "Tasa actualizada",
					data: { code: currency.ISOCode, rate: numericRate },
				});
			} catch (err) {
				const message = err instanceof Error ? err.message : String(err);
				console.error(
					`Error updating rate for currency ${currency.ISOCode}:`,
					err
				);
				return res.status(400).json({
					isOk: false,
					message: `No se pudo actualizar la moneda ${currency.ISOCode}`,
					error: message,
					failedCurrency: { code: currency.ISOCode, error: message },
				});
			}
		} catch (error) {
			console.error("Error updating rate:", error);
			return res.status(500).json({
				isOk: false,
				message: "Error updating rate",
				error: error instanceof Error ? error.message : String(error),
			});
		}
	}
}
