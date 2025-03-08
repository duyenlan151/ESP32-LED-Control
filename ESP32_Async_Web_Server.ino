/*********
  Rui Santos
  Complete project details at https://randomnerdtutorials.com  
*********/

// Import required libraries
#include "WiFi.h"
#include "ESPAsyncWebServer.h"
#include "SPIFFS.h"
#include "ESPmDNS.h"


namespace Config {
  constexpr const char* SSID = "[WIFI NAME]";
  constexpr const char* PASSWORD = "[WIFI PASSWORD]";
  constexpr int LED_PIN = 2;
  constexpr int SERIAL_BAUD = 115200;
  constexpr int WIFI_TIMEOUT_MS = 10000;
}

// LED Controller class
class LEDController {
private:
  const int pin;
  bool state;

public:
  LEDController(int pinNumber) : pin(pinNumber), state(false) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, LOW);
  }

  void setState(bool newState) {
    state = newState;
    digitalWrite(pin, state);
  }

  String getState() const {
    return state ? "ON" : "OFF";
  }
};

// Web Server Handler class
class WebServerHandler {
private:
  AsyncWebServer server;
  LEDController& led;

  static String processTemplate(const String& var, LEDController& controller) {
    if (var == "STATE") {
      String state = controller.getState();
      Serial.println(state);
      return state;
    }
    return String();
  }

public:
  WebServerHandler(LEDController& ledController) 
    : server(80), led(ledController) {}

  void setupRoutes() {
    // Root route
    server.on("/", HTTP_GET, [this](AsyncWebServerRequest* request){
      request->send(SPIFFS, "/index.html", String(), false, 
        [this](const String& var) { return processTemplate(var, led); });
    });

    // Static files
    server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest* request){
      request->send(SPIFFS, "/style.css", "text/css");
    });

    server.on("/script.js", HTTP_GET, [](AsyncWebServerRequest* request){
      request->send(SPIFFS, "/script.js", "text/javascript");
    });

    // LED control routes
    server.on("/on", HTTP_GET, [this](AsyncWebServerRequest* request){
      led.setState(true);
      request->send(SPIFFS, "/index.html", String(), false,
        [this](const String& var) { return processTemplate(var, led); });
    });

    server.on("/off", HTTP_GET, [this](AsyncWebServerRequest* request){
      led.setState(false);
      request->send(SPIFFS, "/index.html", String(), false,
        [this](const String& var) { return processTemplate(var, led); });
    });

    server.begin();
    Serial.println("Web server started");
  }
};

// Global instances
LEDController led(Config::LED_PIN);
WebServerHandler webServer(led);

void setup() {
  Serial.begin(Config::SERIAL_BAUD);

  // Initialize SPIFFS
  if (!SPIFFS.begin(true)) {
    Serial.println("Error: Failed to mount SPIFFS");
    while (true) delay(1000);  // Halt execution
  }

  // Connect to WiFi with timeout
  WiFi.begin(Config::SSID, Config::PASSWORD);
  unsigned long startAttemptTime = millis();
  
  while (WiFi.status() != WL_CONNECTED && 
         millis() - startAttemptTime < Config::WIFI_TIMEOUT_MS) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Error: WiFi connection failed");
    while (true) delay(1000);  // Halt execution
  }

  Serial.print("Connected to WiFi. IP: ");
  Serial.println(WiFi.localIP());

  // Uncomment to enable mDNS
  // if (MDNS.begin("demo-server")) {
  //   Serial.println("mDNS started: demo-server.local");
  // }

  webServer.setupRoutes();
}

void loop() {
  // Empty loop as everything is handled asynchronously
}
