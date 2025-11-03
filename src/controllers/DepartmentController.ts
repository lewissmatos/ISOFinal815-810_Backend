import { BaseController } from "./base/BaseController.ts";
import { AppDataSource } from "../config/data-source.ts";
import { Department } from "../entities/Department.ts";
import { ApiResponse } from "../utils/ApiResponse.util.ts";
import { Request, Response } from "express";

export class DepartmentController extends BaseController<Department> {
	constructor() {
		super(AppDataSource.getRepository(Department));
	}

	async getAll(req: Request, res: Response): Promise<Response> {
		try {
			const data = await this.repository.find({ relations: ["manager"] });
			return ApiResponse.success(res, data);
		} catch (error) {
			console.error("Error fetching data:", error);
			return ApiResponse.error(res, "Error interno del servidor");
		}
	}
}
