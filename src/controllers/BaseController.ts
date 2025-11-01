import type { Request, Response } from "express";
import type { Repository } from "typeorm";
import type { Base } from "../entities/Base.ts";
import { ApiResponse } from "../utils/ApiResponse.util.ts";

export abstract class BaseController<T extends object & Base> {
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

	async create(req: Request, res: Response) {
		const payload = req.body;
		try {
			const newDepartment = this.repository.create({
				...payload,
			});

			const savedItem = await this.repository.save(newDepartment);
			return ApiResponse.created(res, savedItem);
		} catch (error) {
			console.error("Error creating:", error);
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

	async update(req: Request, res: Response) {
		const { id } = req.params;
		const payload = req.body;
		try {
			let item = await this.repository.findOneBy({ id: Number(id) } as any);
			if (!item) {
				return res.status(404).json({ message: "Item not found" });
			}

			item = { ...item, ...payload } as T;

			const updatedItem = await this.repository.save(item);

			return res.status(200).json(updatedItem);
		} catch (error) {
			console.error("Error updating item:", error);
			return res.status(500).json({ message: "Error interno del servidor" });
		}
	}

	async toggleStatus(req: Request, res: Response) {
		const { id } = req.params;
		try {
			const item = await this.repository.findOneBy({ id: Number(id) } as any);
			if (!item) {
				return res.status(404).json({ message: "Item not found" });
			}

			item.isActive = !item.isActive;

			const updatedItem = await this.repository.save(item);

			return res.status(200).json(updatedItem);
		} catch (error) {
			console.error("Error toggling item status:", error);
			return res.status(500).json({ message: "Error interno del servidor" });
		}
	}

	async delete(req: Request, res: Response) {
		const { id } = req.params;
		try {
			const item = await this.repository.findOneBy({ id: Number(id) } as any);
			if (!item) {
				return res.status(404).json({ message: "Item not found" });
			}

			await this.repository.remove(item);

			return res.status(200).json({ message: "Item deleted successfully" });
		} catch (error) {
			console.error("Error deleting item:", error);
			return res.status(500).json({ message: "Error interno del servidor" });
		}
	}
}
