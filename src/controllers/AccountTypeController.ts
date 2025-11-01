import { AppDataSource } from "../config/data-source.ts";
import { AccountType } from "../entities/AccountType.ts";
import { SeedBaseController } from "./base/SeedBaseController.ts";

export class AccountTypeController extends SeedBaseController<AccountType> {
	constructor() {
		super(AppDataSource.getRepository(AccountType));
	}
}
