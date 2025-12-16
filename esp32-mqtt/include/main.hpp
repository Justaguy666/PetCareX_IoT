#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <ESP32Servo.h>

#include "../include/pinConfig.hpp"
#include "../include/deviceConfig.hpp"
#include "../include/mqttConfig.hpp"
#include "./utils.hpp"
#include "./mqtt.hpp"

extern WiFiClientSecure espClient;
extern PubSubClient client;
extern Servo feeder;