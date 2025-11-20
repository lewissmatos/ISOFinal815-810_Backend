import { AppDataSource } from "../config/data-source";
import { AccountType } from "../entities/AccountType";
import { BaseController } from "./BaseController";

export class AccountTypeController extends BaseController<AccountType> {
	constructor() {
		super(AppDataSource.getRepository(AccountType));
	}
}
