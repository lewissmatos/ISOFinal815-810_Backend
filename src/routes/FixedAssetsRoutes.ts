import { Router } from "express";
import { FixedAssetController } from "../controllers/FixedAssetController.ts";

const router = Router();

const fixedAssetController = new FixedAssetController();
router.get("/", fixedAssetController.getAll.bind(fixedAssetController));
router.get(
	"/active",
	fixedAssetController.getActive.bind(fixedAssetController)
);
router.get("/:id", fixedAssetController.getById.bind(fixedAssetController));
router.post("/", fixedAssetController.create.bind(fixedAssetController));
router.put("/:id", fixedAssetController.update.bind(fixedAssetController));
router.patch(
	"/:id/toggle",
	fixedAssetController.toggleStatus.bind(fixedAssetController)
);
router.delete("/:id", fixedAssetController.delete.bind(fixedAssetController));

export default router;
