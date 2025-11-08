import { AppDataSource } from "../config/data-source.ts";
import { BaseController } from "./BaseController.ts";
import { Currency } from "../entities/Currency";

export class CurrencyController extends BaseController<Currency> {
	constructor() {
		super(AppDataSource.getRepository(Currency));
	}
}
