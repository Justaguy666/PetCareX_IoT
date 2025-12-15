import express from 'express';
import NotificationController from '../app/controllers/notificationController.js';

const router = express.Router();

router.post('/warning/mail/food', NotificationController.sendWarningFoodMail);
router.post('/warning/mail/water', NotificationController.sendWarningWaterMail);
router.post('/warning/phone/food', NotificationController.sendWarningFoodPhone);
router.post('/warning/phone/water', NotificationController.sendWarningWaterPhone);

export default router;
