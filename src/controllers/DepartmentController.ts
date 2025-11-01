import { BaseController } from "./base/BaseController.ts";
import { AppDataSource } from "../config/data-source.ts";
import { Department } from "../entities/Department.ts";

export class DepartmentController extends BaseController<Department> {
	constructor() {
		super(AppDataSource.getRepository(Department));
	}
}
