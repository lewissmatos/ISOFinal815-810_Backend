import { Router } from "express";
import { CurrencyController } from "../controllers/CurrencyController.ts";

const router = Router();

const currencyController = new CurrencyController();
router.get("/", currencyController.getAll.bind(currencyController));
export default router;
