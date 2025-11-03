import { AppDataSource } from "../../config/data-source.ts";
import { AccountType } from "../../entities/base/AccountType.ts";
import { SeedBaseController } from "./SeedBaseController.ts";

export class AccountTypeController extends SeedBaseController<AccountType> {
	constructor() {
		super(AppDataSource.getRepository(AccountType));
	}
}
