import { AppDataSource } from "../config/data-source.ts";
import { Currency } from "../entities/Currency.ts";
import { SeedBaseController } from "./base/SeedBaseController.ts";

export class CurrencyController extends SeedBaseController<Currency> {
	constructor() {
		super(AppDataSource.getRepository(Currency));
	}
}
