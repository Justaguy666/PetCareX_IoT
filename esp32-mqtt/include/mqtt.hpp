#include <Arduino.h>
void setup_wifi();

void mqttCallback(char* topic, byte* payload, unsigned int length);

void reconnectMQTT();
