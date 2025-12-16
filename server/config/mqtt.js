import dotenv from "dotenv";

dotenv.config();

export const MQTT_CONFIG = {
    host: process.env.MQTT_HOST,
    port: Number(process.env.MQTT_PORT || 8883),
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,
    protocol: "mqtts",
    reconnectPeriod: 2000,
    keepalive: 60,
};


export const TOPICS = {
    FOOD_LEVEL: process.env.TOPIC_FOOD_LEVEL,
    WATER_LEVEL: process.env.TOPIC_WATER_LEVEL,
    STATUS: process.env.TOPIC_STATUS,
    COMMAND: process.env.TOPIC_COMMAND,
    IS_AUTO: process.env.TOPIC_IS_AUTO,
    FOOD_AMOUNT: process.env.TOPIC_FOOD_AMOUNT,
    SCHEDULE: process.env.TOPIC_SCHEDULE,
};