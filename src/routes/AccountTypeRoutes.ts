import { Router } from "express";
import { AccountTypeController } from "../controllers/AccountTypeController";

const router = Router();

const controller = new AccountTypeController();
router.get("/", controller.getAll.bind(controller));
router.get("/active", controller.getActive.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.post("/", controller.create.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.patch("/:id/toggle", controller.toggleStatus.bind(controller));
router.delete("/:id", controller.delete.bind(controller));
export default router;
