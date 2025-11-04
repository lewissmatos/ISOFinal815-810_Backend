import { Router } from "express";
import { DepreciationController } from "../controllers/DepreciationController.ts";

const router = Router();
const depreciationController = new DepreciationController();

router.get("/", depreciationController.list.bind(depreciationController));

router.get("/:id", depreciationController.getById.bind(depreciationController));

router.post("", depreciationController.processAll.bind(depreciationController));

router.post(
	"/:id",
	depreciationController.processSingle.bind(depreciationController)
);

export default router;
