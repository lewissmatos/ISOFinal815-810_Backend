import { Router } from "express";
import { CurrencyController } from "../controllers/CurrencyController";

const router = Router();

const controller = new CurrencyController();
router.get("/", controller.getAll.bind(controller));
router.get("/active", controller.getActive.bind(controller));
router.get("/sync", controller.syncRates.bind(controller));
router.get("/sync/:id", controller.syncRate.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.post("/", controller.create.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.patch("/:id/toggle", controller.toggleStatus.bind(controller));
router.delete("/:id", controller.delete.bind(controller));
export default router;
