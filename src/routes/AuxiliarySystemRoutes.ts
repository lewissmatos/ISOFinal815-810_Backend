import { Router } from "express";
import { AuxiliarySystemController } from "../controllers/AuxiliarySystemController";

const router = Router();

const controller = new AuxiliarySystemController();
router.get("/", controller.getAll.bind(controller));
router.get("/active", controller.getActive.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.post("/", controller.create.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.patch("/:id/toggle", controller.toggleStatus.bind(controller));
router.delete("/:id", controller.delete.bind(controller));
export default router;
