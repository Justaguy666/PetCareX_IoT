import express from 'express';
import EmailController from '../app/controllers/emailController.js';

const router = express.Router();

router.post('/send-email', EmailController.sendEmail);

export default router;
