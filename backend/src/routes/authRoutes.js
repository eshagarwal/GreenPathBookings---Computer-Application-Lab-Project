import { Router } from "express";
import authController from "../controllers/authController.js";
import middleware from "../middleware/authMiddleware.js";

const { register, login, getProfile, editProfile, changePassword } = authController;
const { authMiddleware } = middleware;

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, editProfile);
router.put("/change-password", authMiddleware, changePassword);

export default router;
