#include "../include/mqtt.hpp"
#include "../include/mqttConfig.hpp"
#include "../include/main.hpp"

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
