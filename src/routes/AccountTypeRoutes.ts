import { Router } from "express";
import { AccountTypeController } from "../controllers/AccountTypeController.ts";

const router = Router();

const accountTypeController = new AccountTypeController();
router.get("/", accountTypeController.getAll.bind(accountTypeController));
export default router;
