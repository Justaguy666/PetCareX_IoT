#include "../include/mqtt.hpp"
#include "../include/mqttConfig.hpp"
#include "../include/main.hpp"

void setup_wifi()
{
  Serial.print("Connecting WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
}

void mqttCallback(char *topic, byte *payload, unsigned int length)
{
  String msg;
  for (int i = 0; i < length; i++)
    msg += (char)payload[i];

  Serial.print("MQTT [");
  Serial.print(topic);
  Serial.print("] ");
  Serial.println(msg);

  if (String(topic) == TOPIC_COMMAND)
  {
    if (msg == "FOOD")
      feedPet();
    if (msg == "WATER")
      waterPet();
  }

  if (String(topic) == TOPIC_IS_AUTO)
  {
    if (msg == "true")
    {
      is_auto = true;
      Serial.println("Auto mode enabled");
    }
    else if (msg == "false")
    {
      is_auto = false;
      Serial.println("Auto mode disabled");
    }
  }

  if (String(topic) == TOPIC_SCHEDULE)
  {
    schedule.clear();

    StaticJsonDocument<5120> doc;
    String msgStr(msg);

    DeserializationError error = deserializeJson(doc, msgStr);
    if (error)
    {
      Serial.print("JSON parse failed: ");
      Serial.println(error.c_str());
      return;
    }

    JsonArray arr = doc.as<JsonArray>();
    for (JsonObject obj : arr)
    {
      const char* timeStr = obj["time"];
      bool enabled = obj["enabled"];
      
      int hour, minute;
      sscanf(timeStr, "%d:%d", &hour, &minute);
      
      ScheduleItem item(hour, minute, enabled);
      schedule.push_back(item);
      
      Serial.print("Item: "); Serial.print(hour); Serial.print(":"); Serial.print(minute);
      Serial.print(" enabled="); Serial.println(enabled);
    }

    Serial.print("Schedule updated, total items: ");
    Serial.println(schedule.size());
  }

  if (String(topic) == TOPIC_FOOD_AMOUNT) {
    Serial.println(msg);
  }
}

void reconnectMQTT()
{
  while (!client.connected())
  {
    Serial.print("Connecting to HiveMQ...");
    if (client.connect("esp32-petcarex", mqtt_user, mqtt_pass))
    {
      Serial.println(" connected");
      client.subscribe(TOPIC_COMMAND);
      client.subscribe(TOPIC_IS_AUTO);
      client.subscribe(TOPIC_SCHEDULE);
      client.subscribe(TOPIC_FOOD_AMOUNT);
    } else {
      Serial.print(" failed, rc=");
      Serial.println(client.state());
      delay(2000);
    }
  }
}
