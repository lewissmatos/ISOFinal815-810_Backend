import { Router } from "express";
import { CurrencyController } from "../../controllers/base/CurrencyController";

const router = Router();

const currencyController = new CurrencyController();
router.get("/", currencyController.getAll.bind(currencyController));
export default router;
