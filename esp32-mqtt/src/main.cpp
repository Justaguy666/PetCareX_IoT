#include "../include/main.hpp"
#include "../include/mqttConfig.hpp"

WiFiClientSecure espClient;
PubSubClient client(espClient);
Servo feeder;
bool is_auto;
std::vector<ScheduleItem> schedule;

// ================= WIFI/MQTT CONFIG =================
const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* mqtt_server = "bb2c782916b34e689328539f4439a1b2.s1.eu.hivemq.cloud";
const int   mqtt_port   = 8883;
const char* mqtt_user   = "petcare";
const char* mqtt_pass   = "Petcare123";

// ================= TIME CONFIG =================
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 7 * 3600; // GMT+7
const int   daylightOffset_sec = 0;
struct tm timeinfo;

void setup() {
  Serial.begin(115200);

  pinMode(TRIG_WATER, OUTPUT);
  pinMode(ECHO_WATER, INPUT);
  pinMode(TRIG_FOOD, OUTPUT);
  pinMode(ECHO_FOOD, INPUT);

  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_STATUS, OUTPUT);
  pinMode(BTN_FEED, INPUT);

  feeder.attach(SERVO_PIN);
  feeder.write(0);

  setup_wifi();

  espClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(mqttCallback);

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  Serial.println("PetCareX ESP32 started (HiveMQ)");

  client.subscribe(TOPIC_COMMAND);
  client.subscribe(TOPIC_IS_AUTO);
  client.subscribe(TOPIC_SCHEDULE);
}

void loop() {
  if (!client.connected()) reconnectMQTT();
  client.loop();

  float distWater = readDistanceCM(TRIG_WATER, ECHO_WATER);
  float distFood  = readDistanceCM(TRIG_FOOD, ECHO_FOOD);

  int waterPercent = calcPercent(distWater, TANK_HEIGHT_CM);
  int foodPercent  = calcPercent(distFood, FOOD_HEIGHT_CM);

  char waterLevelPayload[64];
  char foodLevelPayload[64];

  snprintf(waterLevelPayload, sizeof(waterLevelPayload),
           "%d",
           waterPercent);

  snprintf(foodLevelPayload, sizeof(foodLevelPayload),
           "%d",
           foodPercent);

  client.publish(TOPIC_WATER_LEVEL, waterLevelPayload);
  client.publish(TOPIC_FOOD_LEVEL, foodLevelPayload);

  bool canFeed = (foodPercent >= 20 && waterPercent >= 20);

  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
  }

  const int now[] = {timeinfo.tm_hour, timeinfo.tm_min};

  if (canFeed) {
    digitalWrite(LED_STATUS, HIGH);
  } else {
    digitalWrite(LED_STATUS, LOW);
  }

  if (is_auto) {
    for (auto & scheduleItem : schedule) {
      if (now[0] == scheduleItem.getHour() && now[1] == scheduleItem.getMinute() && scheduleItem.getEnabled() && canFeed) {
        waterAndFeedPet();
        delay(10000);
        break;
      } else if (now[0] == scheduleItem.getHour() && now[1] == scheduleItem.getMinute() && scheduleItem.getEnabled() && !canFeed) {
        Serial.println("Food and water levels sufficient, no need to feed.");
        client.publish(TOPIC_STATUS, "missed");
        delay(10000);
        break;
      }
    }
  }

  if (digitalRead(BTN_FEED) == HIGH && canFeed) {
    waterAndFeedPet();
    delay(2000);
  } else if (digitalRead(BTN_FEED) == HIGH && !canFeed) {
    Serial.println("Food and water levels sufficient, no need to feed.");
    client.publish(TOPIC_STATUS, "missed");
    delay(2000);
  }

  delay(500);
}
