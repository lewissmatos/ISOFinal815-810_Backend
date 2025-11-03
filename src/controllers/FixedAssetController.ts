import { BaseController } from "./base/BaseController.ts";
import { AppDataSource } from "../config/data-source.ts";
import { FixedAsset } from "../entities/FixedAsset.ts";

export class FixedAssetController extends BaseController<FixedAsset> {
	constructor() {
		super(AppDataSource.getRepository(FixedAsset));
	}
}
