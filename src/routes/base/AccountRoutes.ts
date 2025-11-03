import { Router } from "express";
import { AccountController } from "../../controllers/base/AccountController";

const router = Router();

const accountController = new AccountController();
router.get("/", accountController.getAll.bind(accountController));
export default router;
