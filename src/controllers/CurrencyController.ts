import { AppDataSource } from "../config/data-source";
import { BaseController } from "./BaseController";
import { Currency } from "../entities/Currency";
import { SoapExchangeService } from "../services/SoapExchangeService";
import type { Request, Response } from "express";
import { JsonExchangeService } from "../services/JSONExchangeService";

const useJsonRateProvider =
	process.env.CURRENCIES_API_PROTOCOL?.toLowerCase() === "json";

// Select exchange rate provider based on environment configuration.
const rateProvider = useJsonRateProvider
	? JsonExchangeService
	: SoapExchangeService;

export class CurrencyController extends BaseController<Currency> {
	constructor() {
		super(AppDataSource.getRepository(Currency));
	}

	async syncRates(req: Request, res: Response) {
		const queryRunner = AppDataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		let failureCode: string | null = null;
		let failureError: string | null = null;
		const updates: Array<{ code: string; rate: number }> = [];
		try {
			const currencies = await queryRunner.manager.find(Currency);
			for (const currency of currencies) {
				try {
					const rate = await rateProvider.getRate(currency.ISOCode);
					currency.exchangeRate = rate;
					await queryRunner.manager.save(currency);
					updates.push({ code: currency.ISOCode, rate });
				} catch (err) {
					const message = err instanceof Error ? err.message : String(err);
					failureCode = currency.ISOCode;
					failureError = message;
					throw err;
				}
			}
			await queryRunner.commitTransaction();
			return res.status(200).json({
				isOk: true,
				message: "Rates synced",
				data: updates,
			});
		} catch (error) {
			await queryRunner.rollbackTransaction();
			console.error("Error syncing rates:", error);
			const errorMessage = failureCode
				? `No se pudo sincronizar la moneda ${failureCode}`
				: "Error sincronizando tasas";
			return res.status(502).json({
				isOk: false,
				message: errorMessage,
				error: error instanceof Error ? error.message : String(error),
				failedCurrency: failureCode
					? { code: failureCode, error: failureError }
					: null,
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
				const rate = await rateProvider.getRate(currency.ISOCode);
				currency.exchangeRate = rate;
				await this.repository.save(currency);
				return res.status(200).json({
					isOk: true,
					message: "Rates synced",
					data: { code: currency.ISOCode, rate },
				});
			} catch (err) {
				const message = err instanceof Error ? err.message : String(err);
				console.error(
					`Error syncing rate for currency ${currency.ISOCode}:`,
					err
				);
				return res.status(502).json({
					isOk: false,
					message: `No se pudo sincronizar la moneda ${currency.ISOCode}`,
					error: message,
					failedCurrency: { code: currency.ISOCode, error: message },
				});
			}
		} catch (error) {
			console.error("Error syncing rates:", error);
			return res.status(500).json({
				isOk: false,
				message: "Error syncing rates",
				error: error instanceof Error ? error.message : String(error),
			});
		}
	}
}
