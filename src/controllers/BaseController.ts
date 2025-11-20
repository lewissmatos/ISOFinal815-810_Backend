import type { Request, Response } from "express";
import type { Repository, SelectQueryBuilder } from "typeorm";
import { ApiResponse } from "../utils/ApiResponse.util";
import { Base } from "../entities/Base";

export abstract class BaseController<T extends object & Base> {
	protected repository: Repository<T>;

	constructor(repository: Repository<T>) {
		this.repository = repository;
	}

	async getAll(req: Request, res: Response): Promise<Response> {
		try {
			const { qb, alias } = this.createListQueryBuilder();
			const searchTerm = this.getStringQueryParam(req.query.search);
			if (searchTerm) {
				this.applySearchFilter(qb, alias, searchTerm);
			}

			const data = await qb.getMany();
			return ApiResponse.success(res, data);
		} catch (error) {
			console.error("Error fetching data:", error);
			return ApiResponse.error(res, "Error interno del servidor");
		}
	}

	async getActive(req: Request, res: Response) {
		try {
			const active = await this.repository.findBy({ isActive: true } as any);
			return ApiResponse.success(res, active);
		} catch (error) {
			console.error("Error fetching item:", error);
			return ApiResponse.error(res, "Error interno del servidor");
		}
	}
	async getById(req: Request, res: Response): Promise<Response> {
		const { id } = req.params;
		try {
			const item = await this.repository.findOneBy({ id: Number(id) } as any);
			if (!item) {
				return res.status(404).json({ message: "User not found" });
			}
			return ApiResponse.success(res, item);
		} catch (error) {
			console.error("Error fetching item:", error);
			return ApiResponse.error(res, "Error interno del servidor");
		}
	}

	async create(req: Request, res: Response) {
		const payload = req.body;
		try {
			const newItem = this.repository.create({
				...payload,
			});

			const savedItem = await this.repository.save(newItem);
			return ApiResponse.created(res, savedItem);
		} catch (error) {
			console.error("Error creating:", error);
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

	protected createListQueryBuilder() {
		const alias = this.getRepositoryAlias();
		const qb = this.repository.createQueryBuilder(alias);
		for (const relation of this.getRelations()) {
			qb.leftJoinAndSelect(`${alias}.${relation}`, relation);
		}
		return { qb, alias } as {
			qb: SelectQueryBuilder<T>;
			alias: string;
		};
	}

	protected getRelations(): string[] {
		return [];
	}

	protected getSearchableFields(): string[] {
		const searchable = new Set(["name", "description"]);
		return this.repository.metadata.columns
			.map((column) => column.propertyName)
			.filter((property) => searchable.has(property));
	}

	protected applySearchFilter(
		qb: SelectQueryBuilder<T>,
		alias: string,
		search: string
	) {
		const fields = this.getSearchableFields();
		if (fields.length === 0) {
			return;
		}
		const parameter = `%${search}%`;
		const conditions = fields.map((field) => `${alias}.${field} LIKE :search`);
		qb.andWhere(conditions.join(" OR "), { search: parameter });
	}

	protected getStringQueryParam(value: unknown): string | null {
		if (Array.isArray(value)) {
			return this.getStringQueryParam(value[0]);
		}
		if (typeof value !== "string") {
			return null;
		}
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : null;
	}

	protected getNumberQueryParam(value: unknown): number | null {
		if (Array.isArray(value)) {
			return this.getNumberQueryParam(value[0]);
		}
		if (typeof value === "number" && Number.isFinite(value)) {
			return value;
		}
		if (typeof value === "string") {
			const trimmed = value.trim();
			if (!trimmed) {
				return null;
			}
			const parsed = Number(trimmed);
			return Number.isFinite(parsed) ? parsed : null;
		}
		return null;
	}

	protected getDateQueryParam(value: unknown): Date | null {
		if (Array.isArray(value)) {
			return this.getDateQueryParam(value[0]);
		}
		if (value instanceof Date && !Number.isNaN(value.valueOf())) {
			return value;
		}
		if (typeof value === "string") {
			const trimmed = value.trim();
			if (!trimmed) {
				return null;
			}
			const parsed = new Date(trimmed);
			return Number.isNaN(parsed.valueOf()) ? null : parsed;
		}
		return null;
	}

	private getRepositoryAlias() {
		const { targetName, name, tableName } = this.repository.metadata;
		if (typeof targetName === "string" && targetName.length > 0) {
			return targetName;
		}
		if (typeof name === "string" && name.length > 0) {
			return name;
		}
		return tableName;
	}
}
