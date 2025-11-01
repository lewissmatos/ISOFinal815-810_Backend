import { BaseController } from "./base/BaseController.ts";
import { AppDataSource } from "../config/data-source.ts";
import { TypeOfAsset } from "../entities/TypeOfAsset.ts";

export class TypeOfAssetController extends BaseController<TypeOfAsset> {
	constructor() {
		super(AppDataSource.getRepository(TypeOfAsset));
	}
}
