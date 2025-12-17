import { esp32Store } from "../../stores/esp32Store.js";
import {
  publishCommand,
  publishIsAuto,
  publishFoodAmount,
  publishSchedule
 } from "../../services/esp32Service.js";

class Esp32Controller {
  getFoodLevel = async (req, res) => {
    console.log(esp32Store.foodLevel);
    res.json({ ok: true, foodLevel: esp32Store.foodLevel });
  };

  getWaterLevel = async (req, res) => {
    console.log(esp32Store.waterLevel);
    res.json({ ok: true, waterLevel: esp32Store.waterLevel });
  };

  food = async (req, res) => {
    publishCommand("FOOD");
    return res.json({ ok: true });
  };

  water = async (req, res) => {
    publishCommand("WATER");
    return res.json({ ok: true });
  };

  toggleAuto = async (req, res) => {
    publishIsAuto(req.body.mode);
    return res.json({ ok: true });
  }

  changeFoodAmount = async (req, res) => {
    publishFoodAmount(req.body.amount);
    return res.json({ ok: true });
  }

  changeSchedule = async (req, res) => {
    publishSchedule(req.body.schedule);
    return res.json({ ok: true });
  };
}

export default new Esp32Controller();
