import { AppDataSource } from "../config/data-source.ts";
import { Account } from "../entities/Account.ts";
import { SeedBaseController } from "./base/SeedBaseController.ts";

export class AccountController extends SeedBaseController<Account> {
	constructor() {
		super(AppDataSource.getRepository(Account));
	}
}
