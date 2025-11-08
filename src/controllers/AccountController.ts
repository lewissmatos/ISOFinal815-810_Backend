import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source.ts";
import { Account } from "../entities/Account.ts";
import { ApiResponse } from "../utils/ApiResponse.util.ts";
import { BaseController } from "./BaseController.ts";

export class AccountController extends BaseController<Account> {
	constructor() {
		super(AppDataSource.getRepository(Account));
	}

	async getAll(req: Request, res: Response) {
		try {
			const items = await this.repository.find({
				relations: ["accountType", "parentAccount"],
			});
			const response = ApiResponse.success<Account[]>(
				res,
				items,
				"Accounts retrieved successfully"
			);
			return res.status(200).json(response);
		} catch (error) {
			console.error("Error retrieving accounts:", error);
			const response = ApiResponse.error(res, "Error interno del servidor");
			return res.status(500).json(response);
		}
	}
}
