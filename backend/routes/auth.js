import express from "express";
import { signup } from "../controller/auth_controller.js";
import { login } from "../controller/auth_controller.js";
import { logout } from "../controller/auth_controller.js";
import { verifyEmail } from "../controller/auth_controller.js";
import { forgotPassword } from "../controller/auth_controller.js";
import { resetPassword } from "../controller/auth_controller.js";
import { checkAuth } from "../controller/auth_controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
router.get("/check-auth", verifyToken, checkAuth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-email", verifyEmail);
router.post("/reset-password/:token", resetPassword);

export default router;
