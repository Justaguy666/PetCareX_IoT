#include "../include/main.hpp"
#include "../include/mqttConfig.hpp"

WiFiClientSecure espClient;
PubSubClient client(espClient);
Servo feeder;

// ================= WIFI/MQTT CONFIG =================
const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* mqtt_server = "bb2c782916b34e689328539f4439a1b2.s1.eu.hivemq.cloud";
const int   mqtt_port   = 8883;
const char* mqtt_user   = "petcare";
const char* mqtt_pass   = "Petcare123";

void setup() {
  Serial.begin(115200);

  pinMode(TRIG_WATER, OUTPUT);
  pinMode(ECHO_WATER, INPUT);
  pinMode(TRIG_FOOD, OUTPUT);
  pinMode(ECHO_FOOD, INPUT);

  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_STATUS, OUTPUT);
  pinMode(BTN_FEED, INPUT_PULLUP);

  feeder.attach(SERVO_PIN);
  feeder.write(0);

  setup_wifi();

  espClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(mqttCallback);

  Serial.println("🚀 PetCareX ESP32 started (HiveMQ)");
}

void loop() {
  if (!client.connected()) reconnectMQTT();
  client.loop();

  float distWater = readDistanceCM(TRIG_WATER, ECHO_WATER);
  float distFood  = readDistanceCM(TRIG_FOOD, ECHO_FOOD);

  int waterPercent = calcPercent(distWater, TANK_HEIGHT_CM);
  int foodPercent  = calcPercent(distFood, FOOD_HEIGHT_CM);

  char payload[64];
  snprintf(payload, sizeof(payload),
           "{\"water\":%d,\"food\":%d}",
           waterPercent, foodPercent);

  client.publish(TOPIC_SENSOR, payload);

  digitalWrite(RELAY_PIN, waterPercent < 30 ? HIGH : LOW);

  if (foodPercent < 20) {
    feedPet();
    delay(5000);
  }

  if (digitalRead(BTN_FEED) == LOW) {
    feedPet();
    delay(2000);
  }

  delay(3000);
}
