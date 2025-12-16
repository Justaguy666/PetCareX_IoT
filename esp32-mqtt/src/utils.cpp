#include "../include/utils.hpp"
#include "../include/main.hpp"

float readDistanceCM(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 10000);
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
  Serial.println("Feeding pet...");
  feeder.write(90);
  digitalWrite(RELAY_PIN, HIGH);
  delay(1500);
  feeder.write(0);
  digitalWrite(RELAY_PIN, LOW);
  client.publish(TOPIC_STATUS, "success");  
}

void waterPet() {
  Serial.println("Water pet...");
  digitalWrite(RELAY_PIN, HIGH);
  delay(1500);
  digitalWrite(RELAY_PIN, LOW);
  client.publish(TOPIC_STATUS, "success");  
}
