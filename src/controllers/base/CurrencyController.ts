import { AppDataSource } from "../../config/data-source.ts";
import { Currency } from "../../entities/base/Currency.ts";
import { SeedBaseController } from "./SeedBaseController.ts";

export class CurrencyController extends SeedBaseController<Currency> {
	constructor() {
		super(AppDataSource.getRepository(Currency));
	}
}
