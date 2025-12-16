// ================= WIFI =================
extern const char* ssid;
extern const char* password;

// ================= MQTT =================
extern const char* mqtt_server;
extern const int   mqtt_port;
extern const char* mqtt_user;
extern const char* mqtt_pass;

#define TOPIC_STATUS   "petcarex/status"
#define TOPIC_SENSOR   "petcarex/sensor"
#define TOPIC_COMMAND  "petcarex/command"