import type { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { AppDataSource } from "../config/data-source";
import { AuxiliarySystem } from "../entities/AuxiliarySystem";

export class AuxiliarySystemController extends BaseController<AuxiliarySystem> {
	constructor() {
		super(AppDataSource.getRepository(AuxiliarySystem));
	}
}
