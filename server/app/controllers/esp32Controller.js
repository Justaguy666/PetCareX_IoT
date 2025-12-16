import { publishCommand,
         publishIsAuto,
         publishFoodAmount,
 } from "../../services/esp32Service.js";

class Esp32Controller {
  food = async (req, res) => {
    try {
      const command = "FOOD";

      await publishCommand(command);

      return res.json({ ok: true, published: command });
    } catch (err) {
      return res.status(500).json({ error: err?.message || "Internal error" });
    }
  };

  water = async (req, res) => {
    try {
      const command = "WATER";

      await publishCommand(command);

      return res.json({ ok: true, published: command });
    } catch (err) {
      return res.status(500).json({ error: err?.message || "Internal error" });
    }
  };

  toggleAuto = async (req, res) => {
    try {
        const mode = req.body?.mode;

        if(!mode) {
            return res.status(400).json({ error: "Missing mode" });
        }
  
        await publishIsAuto(mode);
  
        return res.json({ ok: true, published: mode });
    } catch (err) {
        return res.status(500).json({ error: err?.message || "Internal error" });
    }
  }

  // SCHEDULE


  // FOOD AMOUNT
  changeFoodAmount = async (req, res) => {
    try {
        const amount = String(req.body?.amount);
        if(!amount) {
            return res.status(400).json({ error: "Missing amount" });
        }
        await publishFoodAmount(amount);
        
        return res.json({ ok: true, published: amount });
    } catch (err) {
        return res.status(500).json({ error: err?.message || "Internal error" });
    }
  }
}

export default new Esp32Controller();
