import type { Request, Response } from "express";
import { BaseController } from "./BaseController.ts";
import { AppDataSource } from "../config/data-source.ts";
import { AuxiliarySystem } from "../entities/AuxiliarySystem.ts";

export class AuxiliarySystemController extends BaseController<AuxiliarySystem> {
	constructor() {
		super(AppDataSource.getRepository(AuxiliarySystem));
	}
}
