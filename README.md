# 🐾 PetCareX - IoT Pet Monitoring System

Hệ thống giám sát và chăm sóc thú cưng thông minh sử dụng ESP32 và MQTT.

## 📋 Tổng quan

Dự án bao gồm 2 phần chính:
- **ESP32-MQTT**: Firmware cho thiết bị ESP32 (mô phỏng trên Wokwi)
- **React-UI**: Giao diện web để giám sát và điều khiển

## 🛠️ Yêu cầu hệ thống

- **VS Code** với các extensions:
  - PlatformIO IDE
  - Wokwi Simulator
- **Node.js** (v16 trở lên)
- **Git**

## 🚀 Hướng dẫn cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd PetCareX-IoT
```

### 2. Cài đặt phần ESP32

```bash
cd esp32-mqtt
```

#### Build firmware:
- Mở VS Code
- Nhấn `Ctrl+Shift+P`
- Chọn `PlatformIO: Build`

#### Chạy mô phỏng với Wokwi:
- Nhấn `F1`
- Gõ `Wokwi: Start Simulator`
- Hoặc click nút ▶️ trên thanh công cụ Wokwi

### 3. Cài đặt phần React UI

```bash
cd ../react-ui
npm install
```

## ▶️ Chạy dự án

### Chạy ESP32 Simulator (Wokwi)

1. Mở folder `esp32-mqtt` trong VS Code
2. Build project: `PlatformIO: Build`
3. Start Wokwi: `Wokwi: Start Simulator`
4. Xem Serial Monitor để theo dõi logs

### Chạy React UI

```bash
cd react-ui
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

## 📡 Cấu trúc dự án

```
PetCareX-IoT/
├── esp32-mqtt/              # ESP32 Firmware
│   ├── src/
│   │   └── main.cpp         # Code chính
│   ├── platformio.ini       # Cấu hình PlatformIO
│   ├── diagram.json         # Sơ đồ Wokwi
│   └── wokwi.toml          # Cấu hình Wokwi
│
└── react-ui/                # Web Interface
    ├── src/
    │   ├── main.js         # Entry point
    │   └── style.css       # Styles
    ├── package.json
    └── index.html
```

## 🔧 Cấu hình

### ESP32 (main.cpp)

```cpp
const char* ssid = "YOUR_WIFI";          // Tên WiFi
const char* password = "YOUR_PASSWORD";   // Mật khẩu WiFi
const char* mqtt_server = "broker.hivemq.com";
```

**Lưu ý**: Khi chạy trên Wokwi, WiFi sẽ tự động được mô phỏng.

### MQTT Topics

- **Publish**: `esp32/test` - ESP32 gửi dữ liệu cảm biến
- **Subscribe**: `esp32/control` - ESP32 nhận lệnh điều khiển

## 📊 Dữ liệu cảm biến (mẫu)

```json
{
  "deviceId": "esp32-client",
  "timestamp": "2025-12-10T10:30:00Z",
  "temperature": 25.5,
  "humidity": 65.0,
  "waterLevel": 80,
  "foodLevel": 75,
  "petDetected": true
}
```

## 🎮 Lệnh điều khiển (mẫu)

```json
{"action": "feed"}
{"action": "water"}
```

## 🐛 Xử lý lỗi thường gặp

### Lỗi: `firmware.bin not found`
- Chạy build lại: `PlatformIO: Build`

### Lỗi: `MQTT connection failed`
- Kiểm tra kết nối internet
- Thử MQTT broker khác

### Lỗi: `pio command not found`
- Sử dụng PlatformIO IDE trong VS Code
- Hoặc dùng Command Palette (`Ctrl+Shift+P`)

## 📦 Thư viện sử dụng

### ESP32
- `PubSubClient` - MQTT client
- `ArduinoJson` - JSON parsing
- `WiFi` - WiFi connectivity

### React UI
- `Vite` - Build tool
- `mqtt` - MQTT client cho browser

## 🤝 Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

MIT License

## 👥 Tác giả

PetCareX Team

## 📞 Liên hệ

- Email: contact@petcarex.io
- GitHub: [PetCareX-IoT](https://github.com/yourrepo)

---

**Happy Coding! 🚀**
