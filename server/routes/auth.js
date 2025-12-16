import express from 'express';
import AuthController from '../app/controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// [POST] /api/auth/register
router.post('/register', AuthController.register);

// [POST] /api/auth/login
router.post('/login', AuthController.login);

// [POST] /api/auth/refreshToken
router.post('/refresh-token', AuthController.refreshToken);

// [POST] /api/auth/logout
router.post('/logout', AuthController.logout);

// [POST] /api/auth/forgotPassword
router.post('/forgot-password', AuthController.forgotPassword);

// [PATCH] /api/auth/changePassword
router.patch('/change-password', authMiddleware, AuthController.changePassword);

export default router;
