import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();
const controller = new AuthController();

router.post("/login", controller.login.bind(controller));
router.post("/signup", controller.signup.bind(controller));

export default router;
