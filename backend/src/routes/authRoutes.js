import { Router } from 'express';
import authController from '../controllers/authController.js';
import middleware from '../middleware/authMiddleware.js';

const { register, login, getProfile } = authController;
const { authMiddleware } = middleware;

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authMiddleware, getProfile);

export default router;