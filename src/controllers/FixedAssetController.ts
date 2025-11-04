import { BaseController } from "./base/BaseController.ts";
import { AppDataSource } from "../config/data-source.ts";
import { FixedAsset } from "../entities/FixedAsset.ts";
import { ApiResponse } from "../utils/ApiResponse.util.ts";
import { Request, Response } from "express";

export class FixedAssetController extends BaseController<FixedAsset> {
	constructor() {
		super(AppDataSource.getRepository(FixedAsset));
	}

	async getAll(_: Request, res: Response): Promise<Response> {
		try {
			const data = await this.repository.find({
				relations: [
					"department",
					"typeOfAsset",
					"typeOfAsset.purchaseAccount",
					"typeOfAsset.depreciationAccount",
				],
			});
			return ApiResponse.success(res, data);
		} catch (error) {
			console.error("Error fetching data:", error);
			return ApiResponse.error(res, "Error interno del servidor");
		}
	}
}
