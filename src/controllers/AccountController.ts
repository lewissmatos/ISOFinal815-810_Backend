import { AppDataSource } from "../config/data-source.ts";
import { Account } from "../entities/Account.ts";
import { BaseController } from "./BaseController.ts";

export class AccountController extends BaseController<Account> {
	constructor() {
		super(AppDataSource.getRepository(Account));
	}

	protected override getRelations(): string[] {
		return ["accountType", "parentAccount"];
	}
}
