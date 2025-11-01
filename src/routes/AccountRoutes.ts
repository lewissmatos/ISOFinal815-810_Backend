import { Router } from "express";
import { AccountController } from "../controllers/AccountController.ts";

const router = Router();

const accountController = new AccountController();
router.get("/", accountController.getAll.bind(accountController));
export default router;
