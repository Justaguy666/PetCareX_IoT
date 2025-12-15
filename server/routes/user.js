import express from 'express';
import userController from '../app/controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/feeding/newest', userController.getNewestFeeding);
router.get('/feeding/next', userController.getNextFeeding);

router.post('/schedule', userController.createFeedingSchedule);
router.put('/schedule', userController.updateFeedingSchedule);
router.delete('/schedule', userController.deleteFeedingSchedule);

router.get('/statistics', userController.getFeedingStatistics);
router.get('/weekly-report', userController.getWeeklyReport);

router.get('/settings', userController.getSettings);
router.put('/settings', userController.updateSettings);

router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);

export default router;
