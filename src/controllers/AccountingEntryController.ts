import type { Request, Response } from "express";
import { AppDataSource } from "../config/data-source.ts";
import { AccountingEntry } from "../entities/AccountingEntry.ts";
import { ApiResponse } from "../utils/ApiResponse.util.ts";
import { Base } from "../entities/Base.ts";
import { BaseController } from "./BaseController.ts";
import { Account } from "../entities/Account.ts";

export class AccountingEntryController extends BaseController<AccountingEntry> {
	constructor() {
		super(AppDataSource.getRepository(AccountingEntry));
	}

	async getAll(req: Request, res: Response) {
		try {
			const items = await this.repository.find({
				relations: ["account", "auxiliary"],
			});
			const response = ApiResponse.success<AccountingEntry[]>(
				res,
				items,
				"Accounting entries retrieved successfully"
			);
			return res.status(200).json(response);
		} catch (error) {
			console.error("Error retrieving accounting entries:", error);
			const response = ApiResponse.error(res, "Error interno del servidor");
			return res.status(500).json(response);
		}
	}

	async create(req: Request, res: Response) {
		try {
			const item = this.repository.create(req.body);
			const savedItem = await this.repository.save(item);
			return res.status(201).json(savedItem);
		} catch (error) {
			console.error("Error creating accounting entry:", error);
			const response = ApiResponse.error(res, "Error interno del servidor");
			return res.status(500).json(response);
		}
	}
}
