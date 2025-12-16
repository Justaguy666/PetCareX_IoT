import express from 'express';
import Esp32Controller from '../app/controllers/esp32Controller.js';

const router = express.Router();

router.get('/food-level', Esp32Controller.getFoodLevel);
router.get('/water-level', Esp32Controller.getWaterLevel);
router.post('/food', Esp32Controller.food);
router.post('/water', Esp32Controller.water);
router.post('/toggle-auto', Esp32Controller.toggleAuto);
router.post('/food-amount', Esp32Controller.changeFoodAmount);
router.post('/schedule', Esp32Controller.changeSchedule);

export default router;
