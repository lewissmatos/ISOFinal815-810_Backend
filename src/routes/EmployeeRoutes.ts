import { Router } from "express";
import { EmployeeController } from "../controllers/EmployeeController.ts";

const router = Router();

const employeeController = new EmployeeController();
router.get("/", employeeController.getAll.bind(employeeController));
router.get("/active", employeeController.getAll.bind(employeeController));
router.get("/:id", employeeController.getById.bind(employeeController));
router.post("/", employeeController.create.bind(employeeController));
router.put("/:id", employeeController.update.bind(employeeController));
router.patch(
	"/:id/toggle",
	employeeController.toggleStatus.bind(employeeController)
);
router.delete("/:id", employeeController.delete.bind(employeeController));

export default router;
