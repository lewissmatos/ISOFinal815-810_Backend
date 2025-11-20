import { AppDataSource } from "../config/data-source";
import { BaseController } from "./BaseController";
import { Currency } from "../entities/Currency";
import { SoapExchangeService } from "../services/SoapExchangeService";
import type { Request, Response } from "express";

export class CurrencyController extends BaseController<Currency> {
	constructor() {
		super(AppDataSource.getRepository(Currency));
	}

	async syncRates(req: Request, res: Response) {
		try {
			const currencies = await this.repository.find();
			const results: Array<{
				code: string;
				success: boolean;
				rate?: number;
				error?: string;
			}> = [];
			for (const c of currencies) {
				try {
					const rate = await SoapExchangeService.getRate(c.ISOCode);
					c.exchangeRate = rate;
					console.log("Currency:", c.ISOCode, "Rate:", rate);
					await this.repository.save(c);
					results.push({ code: c.ISOCode, success: true, rate });
				} catch (err: any) {
					results.push({
						code: c.ISOCode,
						success: false,
						error: err?.message ?? String(err),
					});
				}
			}
			return res
				.status(200)
				.json({ isOk: true, message: "Rates synced", data: results });
		} catch (error) {
			console.error("Error syncing rates:", error);
			return res
				.status(500)
				.json({ isOk: false, message: "Error syncing rates" });
		}
	}

	async syncRate(req: Request, res: Response) {
		try {
			const currency = await this.repository.findOneBy({
				id: Number(req.params.id),
			});
			let result: {
				code: string;
				success: boolean;
				rate?: number;
				error?: string;
			} = { code: "", success: false };
			if (!currency) {
				return res
					.status(404)
					.json({ isOk: false, message: "Currency not found" });
			}
			try {
				const rate = await SoapExchangeService.getRate(currency.ISOCode);
				currency.exchangeRate = rate;
				await this.repository.save(currency);
				result = { code: currency.ISOCode, success: true, rate };
			} catch (err: any) {
				result = {
					code: currency.ISOCode,
					success: false,
					error: err?.message ?? String(err),
				};
			}
			return res
				.status(200)
				.json({ isOk: true, message: "Rates synced", data: result });
		} catch (error) {
			console.error("Error syncing rates:", error);
			return res
				.status(500)
				.json({ isOk: false, message: "Error syncing rates" });
		}
	}
}
