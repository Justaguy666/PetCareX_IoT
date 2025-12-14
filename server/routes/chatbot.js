import express from 'express';
import ChatbotController from '../app/controllers/chatbotController.js';

const router = express.Router();

router.post('/', ChatbotController.chat);

export default router;
