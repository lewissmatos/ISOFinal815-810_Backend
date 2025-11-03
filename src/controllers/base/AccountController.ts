import { AppDataSource } from "../../config/data-source.ts";
import { Account } from "../../entities/base/Account.ts";
import { SeedBaseController } from "./SeedBaseController.ts";

export class AccountController extends SeedBaseController<Account> {
	constructor() {
		super(AppDataSource.getRepository(Account));
	}
}
