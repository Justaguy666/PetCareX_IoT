import express from 'express';
import Esp32Controller from '../app/controllers/esp32Controller.js';

const router = express.Router();

router.post('/food', Esp32Controller.food);
router.post('/water', Esp32Controller.water);
router.post('/toggle-auto', Esp32Controller.toggleAuto);
router.post('/food-amount', Esp32Controller.changeFoodAmount);

export default router;
