import { Router } from "express";

import { DepartmentController } from "../controllers/DepartmentController.ts";

const router = Router();

const departmentController = new DepartmentController();
router.get("/", departmentController.getAll.bind(departmentController));
router.get(
	"/active",
	departmentController.getActive.bind(departmentController)
);
router.get("/:id", departmentController.getById.bind(departmentController));
router.post("/", departmentController.create.bind(departmentController));
router.put("/:id", departmentController.update.bind(departmentController));
router.patch(
	"/:id/toggle",
	departmentController.toggleStatus.bind(departmentController)
);
router.delete("/:id", departmentController.delete.bind(departmentController));

export default router;
