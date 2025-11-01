import { Router } from "express";
import { ChartOfAccountController } from "../controllers/ChartOfAccountController.ts";

const router = Router();

const chartOfAccountController = new ChartOfAccountController();
router.get("/", chartOfAccountController.getAll.bind(chartOfAccountController));
export default router;
