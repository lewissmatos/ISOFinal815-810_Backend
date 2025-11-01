import type { Request, Response } from "express";
import type { Repository } from "typeorm";
import { ApiResponse } from "../../utils/ApiResponse.util.ts";

export abstract class SeedBaseController<T extends object & { id: number }> {
	protected repository: Repository<T>;

	constructor(repository: Repository<T>) {
		this.repository = repository;
	}

	async getAll(req: Request, res: Response): Promise<Response> {
		try {
			const data = await this.repository.find();
			return ApiResponse.success(res, data);
		} catch (error) {
			console.error("Error fetching data:", error);
			return ApiResponse.error(res, "Error interno del servidor");
		}
	}

	async getById(req: Request, res: Response): Promise<Response> {
		const { id } = req.params;
		try {
			const item = await this.repository.findOneBy({ id: Number(id) } as any);
			if (!item) {
				return res.status(404).json({ message: "Department not found" });
			}
			return ApiResponse.success(res, item);
		} catch (error) {
			console.error("Error fetching item:", error);
			return ApiResponse.error(res, "Error interno del servidor");
		}
	}
}
