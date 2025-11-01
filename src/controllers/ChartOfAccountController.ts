import { AppDataSource } from "../config/data-source.ts";
import { SeedBaseController } from "./base/SeedBaseController.ts";
import { ChartOfAccount } from "../entities/ChartOfAccount.ts";
import type { Request, Response } from "express";

export class ChartOfAccountController extends SeedBaseController<ChartOfAccount> {
	constructor() {
		super(AppDataSource.getRepository(ChartOfAccount));
	}

	async toggleStatus(req: Request, res: Response) {
		const { id } = req.params;
		try {
			const chartOfAccount = await this.repository.findOneBy({
				id: Number(id),
			} as any);
			if (!chartOfAccount) {
				return res.status(404).json({ message: "Item not found" });
			}

			chartOfAccount.isActive = !chartOfAccount.isActive;

			const updatedItem = await this.repository.save(chartOfAccount);

			return res.status(200).json(updatedItem);
		} catch (error) {
			console.error("Error toggling chartOfAccount status:", error);
			return res.status(500).json({ message: "Error interno del servidor" });
		}
	}
}
