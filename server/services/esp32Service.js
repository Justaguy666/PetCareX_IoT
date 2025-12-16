import mqtt from "mqtt";

const MQTT_HOST = process.env.MQTT_HOST;
const MQTT_PORT = Number(process.env.MQTT_PORT || 8883);
const MQTT_USER = process.env.MQTT_USER;
const MQTT_PASS = process.env.MQTT_PASS;

const TOPIC_COMMAND = process.env.TOPIC_COMMAND;
const TOPIC_IS_AUTO = process.env.TOPIC_IS_AUTO;
const TOPIC_FOOD_AMOUNT = process.env.TOPIC_FOOD_AMOUNT;

let client;
let isConnected = false;

export function initEsp32Mqtt() {
  if (client) return client;

  client = mqtt.connect({
    host: MQTT_HOST,
    port: MQTT_PORT,
    protocol: "mqtts",
    username: MQTT_USER,
    password: MQTT_PASS,
    reconnectPeriod: 2000,
    keepalive: 60,
  });

  client.on("connect", () => {
    isConnected = true;
    console.log("[MQTT] Connected");
  });

  client.on("close", () => {
    isConnected = false;
    console.log("[MQTT] Disconnected");
  });

  client.on("error", (err) => {
    console.log("[MQTT] Error:", err?.message || err);
  });

  return client;
}

export async function publishCommand(command) {
  if (!client) initEsp32Mqtt();
  if (!isConnected) throw new Error("MQTT not connected");

  return new Promise((resolve, reject) => {
    client.publish(TOPIC_COMMAND, command, { qos: 1, retain: false }, (err) => {
      if (err) return reject(err);
      resolve(true);
    });
  });
}

export async function publishIsAuto(mode) {
    if (!client) initEsp32Mqtt();
    if (!isConnected) throw new Error("MQTT not connected");
  
    return new Promise((resolve, reject) => {
      client.publish(TOPIC_IS_AUTO, mode, { qos: 1, retain: false }, (err) => {
        if (err) return reject(err);
        resolve(true);
      });
    });
}

export async function publishFoodAmount(amount) {
    if (!client) initEsp32Mqtt();
    if (!isConnected) throw new Error("MQTT not connected");

    return new Promise((resolve, reject) => {
      client.publish(TOPIC_FOOD_AMOUNT, amount, { qos: 1, retain: false }, (err) => {
        if (err) return reject(err);
        resolve(true);
      });
    });
}