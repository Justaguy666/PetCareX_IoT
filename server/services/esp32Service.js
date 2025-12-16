import mqtt from "mqtt";
import { MQTT_CONFIG, TOPICS } from "../config/mqtt.js";
import { esp32Store } from "../stores/esp32Store.js";
import User from "../app/models/User.js";

let client;

export function initEsp32Mqtt() {
  if (client) return client;

  client = mqtt.connect(MQTT_CONFIG);

  client.on("connect", () => {
    console.log("[MQTT] Connected");

    client.subscribe([
      TOPICS.FOOD_LEVEL,
      TOPICS.WATER_LEVEL,
      TOPICS.STATUS,
    ]);
  });

  client.on("message", async (topic, message) => {
    const value = message.toString();

    switch (topic) {  
      case TOPICS.FOOD_LEVEL:
        esp32Store.foodLevel = value;
        break;
      case TOPICS.WATER_LEVEL:
        esp32Store.waterLevel = value;
        break;
      case TOPICS.STATUS:
        esp32Store.latestStatus = value;
        console.log(`[MQTT] Status update: ${value}`);
        try {
          const users = await User.find({});
          await Promise.all(users.map(async (user) => {
            if (value !== "success" && value !== "missed") return;

            const now = new Date();
            const lastEntry = user.history && user.history.length > 0
              ? user.history[user.history.length - 1]
              : null;

            if (
              lastEntry &&
              lastEntry.status === value &&
              lastEntry.time &&
              (now.getTime() - new Date(lastEntry.time).getTime()) < 2000
            )
            {
              return;
            }

            const newEntry = {
              time: now,
              amount: user.configurations?.food_amount ?? 0,
              status: value
            };
            user.history.push(newEntry);
            await user.save();
          }));
        } catch (err) {
          console.error('[ESP32 SERVICE] Failed to update feeding history:', err);
        }

        break;
      default:
        break;
    }

    esp32Store.updatedAt = new Date();
  });

  client.on("error", (err) => {
    console.log("[MQTT] Error:", err.message);
  });

  return client;
}

export async function publishCommand(command) {
  client.publish(TOPICS.COMMAND, command, { qos: 2 });
}

export async function publishIsAuto(mode) {
  client.publish(TOPICS.IS_AUTO, String(mode), { qos: 2 });
}

export async function publishFoodAmount(amount) {
  client.publish(TOPICS.FOOD_AMOUNT, String(amount), { qos: 2 });
}

export async function publishSchedule(schedule) {
  client.publish(TOPICS.SCHEDULE, JSON.stringify(schedule), { qos: 2 });  
}