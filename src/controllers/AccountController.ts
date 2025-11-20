import { AppDataSource } from "../config/data-source";
import { Account } from "../entities/Account";
import { BaseController } from "./BaseController";

export class AccountController extends BaseController<Account> {
	constructor() {
		super(AppDataSource.getRepository(Account));
	}

	protected override getRelations(): string[] {
		return ["accountType", "parentAccount"];
	}
}
