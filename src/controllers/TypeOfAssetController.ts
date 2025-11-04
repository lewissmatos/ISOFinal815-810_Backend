import { BaseController } from "./base/BaseController.ts";
import { AppDataSource } from "../config/data-source.ts";
import { TypeOfAsset } from "../entities/TypeOfAsset.ts";
import { ApiResponse } from "../utils/ApiResponse.util.ts";
import { Request, Response } from "express";

export class TypeOfAssetController extends BaseController<TypeOfAsset> {
	constructor() {
		super(AppDataSource.getRepository(TypeOfAsset));
	}

	async getAll(req: Request, res: Response): Promise<Response> {
		try {
			const data = await this.repository.find({
				relations: ["purchaseAccount", "depreciationAccount"],
			});
			return ApiResponse.success(res, data);
		} catch (error) {
			console.error("Error fetching data:", error);
			return ApiResponse.error(res, "Error interno del servidor");
		}
	}
}
