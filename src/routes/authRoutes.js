import express from "express";
import authController from "../controllers/auth/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post(
  "/change-password",
  authController.changePassword
);
router.post("/verify-otp", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerificationCode);
router.get("/check-session", protect, authController.checkSession);
router.get("/login-history", protect, authController.loginHistory);
router.get("/users", authController.getUsers);

export default router;
