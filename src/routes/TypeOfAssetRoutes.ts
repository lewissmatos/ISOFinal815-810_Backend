import { Router } from "express";
import { TypeOfAssetController } from "../controllers/TypeOfAssetController.ts";

const router = Router();

const typeOfAssetController = new TypeOfAssetController();
router.get("/", typeOfAssetController.getAll.bind(typeOfAssetController));
router.get(
	"/active",
	typeOfAssetController.getActive.bind(typeOfAssetController)
);
router.get("/:id", typeOfAssetController.getById.bind(typeOfAssetController));
router.post("/", typeOfAssetController.create.bind(typeOfAssetController));
router.put("/:id", typeOfAssetController.update.bind(typeOfAssetController));
router.patch(
	"/:id/toggle",
	typeOfAssetController.toggleStatus.bind(typeOfAssetController)
);
router.delete("/:id", typeOfAssetController.delete.bind(typeOfAssetController));

export default router;
