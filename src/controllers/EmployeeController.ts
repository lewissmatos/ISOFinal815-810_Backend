import { BaseController } from "./base/BaseController.ts";
import { AppDataSource } from "../config/data-source.ts";
import { Employee } from "../entities/Employee.ts";
import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.util.ts";

export class EmployeeController extends BaseController<Employee> {
	constructor() {
		super(AppDataSource.getRepository(Employee));
	}

	async getAll(req: Request, res: Response): Promise<Response> {
		try {
			const data = await this.repository.find({ relations: ["department"] });
			return ApiResponse.success(res, data);
		} catch (error) {
			console.error("Error fetching data:", error);
			return ApiResponse.error(res, "Error interno del servidor");
		}
	}
}
