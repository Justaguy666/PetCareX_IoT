#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <ESP32Servo.h>

/* ================= PIN ================= */
#define TRIG_WATER   4
#define ECHO_WATER   16
#define TRIG_FOOD    5
#define ECHO_FOOD    18

#define SERVO_PIN    13
#define RELAY_PIN    19
#define LED_STATUS   17
#define BTN_FEED     27

/* ================= CONFIG ================= */
#define TANK_HEIGHT_CM   20.0
#define FOOD_HEIGHT_CM  15.0

/* ================= WIFI ================= */
const char* ssid = "Wokwi-GUEST";
const char* password = "";

/* ================= MQTT (HiveMQ) ================= */
const char* mqtt_server = "bb2c782916b34e689328539f4439a1b2.s1.eu.hivemq.cloud";
const int   mqtt_port   = 8883;
const char* mqtt_user   = "petcare";
const char* mqtt_pass   = "Petcare123";

#define TOPIC_STATUS   "petcarex/status"
#define TOPIC_SENSOR   "petcarex/sensor"
#define TOPIC_COMMAND  "petcarex/command"

/* ================= OBJECT ================= */
WiFiClientSecure espClient;
PubSubClient client(espClient);
Servo feeder;

/* ================= FUNCTION ================= */
float readDistanceCM(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000);
  if (duration == 0) return -1;
  return duration * 0.034 / 2;
}

int calcPercent(float distance, float height) {
  if (distance < 0) return 0;
  float level = height - distance;
  int percent = (level / height) * 100;
  return constrain(percent, 0, 100);
}

void feedPet() {
  Serial.println("🐾 Feeding pet...");
  feeder.write(90);
  delay(1500);
  feeder.write(0);
}

void setup_wifi() {
  Serial.print("Connecting WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (int i = 0; i < length; i++) msg += (char)payload[i];

  Serial.print("MQTT [");
  Serial.print(topic);
  Serial.print("] ");
  Serial.println(msg);

  if (String(topic) == TOPIC_COMMAND) {
    if (msg == "FEED") feedPet();
    if (msg == "PUMP_ON") digitalWrite(RELAY_PIN, HIGH);
    if (msg == "PUMP_OFF") digitalWrite(RELAY_PIN, LOW);
  }
}

void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Connecting to HiveMQ...");
    if (client.connect("esp32-petcarex", mqtt_user, mqtt_pass)) {
      Serial.println(" connected");
      client.subscribe(TOPIC_COMMAND);
      client.publish(TOPIC_STATUS, "ESP32 Online");
    } else {
      Serial.print(" failed, rc=");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

/* ================= SETUP ================= */
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

/* ================= LOOP ================= */
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
