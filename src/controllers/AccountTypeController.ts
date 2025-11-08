import { AppDataSource } from "../config/data-source.ts";
import { AccountType } from "../entities/AccountType.ts";
import { BaseController } from "./BaseController.ts";

export class AccountTypeController extends BaseController<AccountType> {
	constructor() {
		super(AppDataSource.getRepository(AccountType));
	}
}
