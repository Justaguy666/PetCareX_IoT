#include "../include/main.hpp"
#include "../include/mqttConfig.hpp"

#include <math.h>

WiFiClientSecure espClient;
PubSubClient client(espClient);
Servo feeder;
bool is_auto;
bool can_feed;
bool can_water;
std::vector<ScheduleItem> schedule;

// ================= WIFI/MQTT CONFIG =================
const char *ssid = "Wokwi-GUEST";
const char *password = "";
const char *mqtt_server = "bb2c782916b34e689328539f4439a1b2.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char *mqtt_user = "petcare";
const char *mqtt_pass = "Petcare123";

// ================= TIME CONFIG =================
const char *ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 7 * 3600; // GMT+7
const int daylightOffset_sec = 0;
struct tm timeinfo;
int lastFeedHour = -1;
int lastFeedMinute = -1;

void setup()
{
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

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  Serial.println("PetCareX ESP32 started (HiveMQ)");
}

void loop()
{
  if (!client.connected()) reconnectMQTT();

  client.loop();

  float distWater = readDistanceCM(TRIG_WATER, ECHO_WATER);
  float distFood = readDistanceCM(TRIG_FOOD, ECHO_FOOD);

  int waterPercent = calcPercent(distWater, TANK_HEIGHT_CM);
  int foodPercent = calcPercent(distFood, FOOD_HEIGHT_CM);

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

  can_feed = foodPercent >= 20;
  can_water = waterPercent >= 20;
  bool can_feed_and_water = can_feed && can_water;

  if (!getLocalTime(&timeinfo))
  {
    Serial.println("Failed to obtain time");
  }

  const int now[] = {timeinfo.tm_hour, timeinfo.tm_min};

  if (can_feed_and_water)
  {
    digitalWrite(LED_STATUS, HIGH);
  }
  else
  {
    digitalWrite(LED_STATUS, LOW);
  }

  if (is_auto)
  {
    for (auto &scheduleItem : schedule)
    {
      bool isTimeMatch = now[0] == scheduleItem.getHour() && now[1] == scheduleItem.getMinute();

      bool notFedYet =
          !(lastFeedHour == now[0] && lastFeedMinute == now[1]);

      if (isTimeMatch && notFedYet && scheduleItem.getEnabled())
      {

        if (can_feed_and_water)
        {
          waterAndFeedPet();
          client.publish(TOPIC_STATUS, "success");

          lastFeedHour = now[0];
          lastFeedMinute = now[1];

          break;
        }
        else
        {
          client.publish(TOPIC_STATUS, "missed");

          lastFeedHour = now[0];
          lastFeedMinute = now[1];
          
          break;
        }
      }
    }
  }

  if (digitalRead(BTN_FEED) == HIGH && can_feed_and_water)
  {
    waterAndFeedPet();
    client.publish(TOPIC_STATUS, "success");
    delay(2000);
  }
  else if (digitalRead(BTN_FEED) == HIGH && !can_feed_and_water)
  {
    Serial.println("Food and water levels insufficient, cannot feed now.");
    client.publish(TOPIC_STATUS, "missed");
    delay(2000);
  }

  delay(1000);
}
