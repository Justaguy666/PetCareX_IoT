import express from 'express';
import NotificationController from '../app/controllers/notificationController.js';

const router = express.Router();

router.post('/warning/mail/food', NotificationController.sendWarningFoodMail);
router.post('/warning/mail/water', NotificationController.sendWarningWaterMail);
router.post('/warning/phone/food', NotificationController.sendWarningFoodPhone);
router.post('/warning/phone/water', NotificationController.sendWarningWaterPhone);
router.post('/schedule-tentative/mail', NotificationController.sendScheduleTentativeMail);
router.post('/schedule-tentative/phone', NotificationController.sendScheduleTentativePhone);
router.post('/schedule-now/mail', NotificationController.sendScheduleMail);
router.post('/schedule-now/phone', NotificationController.sendSchedulePhone);

export default router;
