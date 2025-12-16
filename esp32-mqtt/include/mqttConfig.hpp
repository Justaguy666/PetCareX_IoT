// ================= WIFI =================
extern const char* ssid;
extern const char* password;

// ================= MQTT =================
extern const char* mqtt_server;
extern const int   mqtt_port;
extern const char* mqtt_user;
extern const char* mqtt_pass;

#define TOPIC_STATUS       "petcarex/status"
#define TOPIC_FOOD_LEVEL   "petcarex/food_level"
#define TOPIC_WATER_LEVEL  "petcarex/water_level"
#define TOPIC_COMMAND      "petcarex/command"
#define TOPIC_IS_AUTO      "petcarex/is_auto"
#define TOPIC_SCHEDULE     "petcarex/schedule"