import { Router } from "express";
import { AccountingEntryController } from "../controllers/AccountingEntryController.ts";

const router = Router();
const controller = new AccountingEntryController();

router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));

export default router;
