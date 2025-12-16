#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>
#include <vector>

#include "time.h"
#include "../include/pinConfig.hpp"
#include "../include/deviceConfig.hpp"
#include "../include/mqttConfig.hpp"
#include "./utils.hpp"
#include "./mqtt.hpp"
#include "../include/ScheduleItem.hpp"

extern WiFiClientSecure espClient;
extern PubSubClient client;
extern Servo feeder;
extern bool is_auto;
extern std::vector<ScheduleItem> schedule;