
ESP32 LED Control
----------------

The ESP32 hosts a simple web server that allows users to turn an LED (connected to GPIO 2) ON or OFF through a webpage. The webpage is stored in the SPIFFS filesystem and served dynamically with the current LED state. The project uses asynchronous web server techniques for efficient handling of requests.

### Features

-   Control an LED via a web interface.
-   Displays the current LED state (ON/OFF) on the webpage.
-   Asynchronous web server for better performance.
-   Supports WiFi connectivity with a timeout mechanism.
-   Optional mDNS support (commented out in the code).

* * * * *

Prerequisites
-------------

### Hardware

-   **ESP32 Development Board** (e.g., ESP32 DevKit V1)
-   **LED** (connected to GPIO 2 with an appropriate current-limiting resistor)
-   **Computer** with USB cable for programming
-   **WiFi Network** (with internet access for initial setup)

### Software

-   **Arduino IDE** (or any compatible IDE like PlatformIO)
-   Installed libraries:
    -   WiFi.h (built-in with ESP32 board support)
    -   ESPAsyncWebServer (install via Library Manager)
    -   SPIFFS (built-in with ESP32 board support)
    -   ESPmDNS (optional, built-in with ESP32 board support)
-   ESP32 board support added to Arduino IDE (see [this guide](https://randomnerdtutorials.com/installing-the-esp32-board-in-arduino-ide-windows-instructions/))

* * * * *

Setup Instructions
------------------

### Step 1: Wiring the LED

1.  Connect the LED to the ESP32:
    -   **Anode (+)** of the LED to GPIO 2 (via a 220Ω resistor).
    -   **Cathode (-)** of the LED to GND.
2.  Verify the connections to avoid damaging the ESP32 or LED.

**Suggested Image:**\
*Insert an image of the wiring setup here (e.g., a Fritzing diagram or a photo of the ESP32 with the LED connected).*\
![Wiring Diagram](images/esp32-led-wiring.png)

* * * * *

### Step 2: Preparing the Filesystem

1.  Create a data folder in your Arduino sketch directory.
2.  Inside the data folder, add the following files:
    -   index.html: The main webpage (example below).
    -   style.css: Stylesheet for the webpage.
    -   script.js: JavaScript for client-side functionality.

#### Example index.html

html

PreviewCollapseWrapCopy

```html
<!DOCTYPE html>
<html>

<head>
  <title>ESP32 LED Control</title>
  <link rel="stylesheet" href="style.css">
</head>

<body>
  <h1>ESP32 LED Control</h1>
  <p>LED State: <span id="state">%STATE%</span></p> <button onclick="window.location.href='/on'">Turn ON</button>
  <button onclick="window.location.href='/off'">Turn OFF</button>
  <script src="script.js"></script>
</body>

</html>

```

#### Example style.css

css

CollapseWrapCopy

```
body {
  font-family: Arial, sans-serif;
  text-align: center;
}
button {
  padding: 10px 20px; margin: 5px;
}
```

#### Example script.js

1.  Upload the files to the ESP32's SPIFFS:
    -   In Arduino IDE, install the **ESP32FS** plugin (see [instructions](https://randomnerdtutorials.com/install-esp32-filesystem-uploader-arduino-ide/)).
    -   Use **Tools > ESP32 Sketch Data Upload** to upload the data folder contents.

* * * * *

### Step 3: Configuring the Code

1.  Open the Arduino IDE and paste the provided code.
2.  Update the WiFi credentials in the Config namespace:
```
namespace Config {
  constexpr const char* SSID = "[WIFI NAME]";
  constexpr const char* PASSWORD = "[WIFI PASSWORD]";
  constexpr int LED_PIN = 2;
  constexpr int SERIAL_BAUD = 115200;
  constexpr int WIFI_TIMEOUT_MS = 10000;
}
```

3.  Optionally, uncomment the mDNS section in the setup() function to access the server via http://demo-server.local.

* * * * *

### Step 4: Uploading the Code

1.  Connect the ESP32 to your computer via USB.
2.  Select the correct board and port in Arduino IDE:
    -   **Tools > Board > ESP32 Dev Module**
    -   **Tools > Port > [Your COM port]**
3.  Click **Upload** to compile and upload the code to the ESP32.

* * * * *

Running the Project
-------------------

1.  Open the Serial Monitor in Arduino IDE (**Ctrl+Shift+M**) at 115200 baud to monitor the connection process.
2.  Wait for the ESP32 to connect to WiFi. You'll see output like:

    text

    CollapseWrapCopy

    ````
    Connecting to WiFi...
    Connected to WiFi. IP: 192.168.1.100
    Web server started
    ````

3.  Note the IP address printed (e.g., 192.168.1.100).
4.  Open a web browser on a device connected to the same WiFi network.
5.  Enter the IP address (e.g., http://192.168.1.100) in the address bar.
6.  The webpage should load, showing the LED state and buttons to turn it ON or OFF.

**Suggested Video:**\
*Insert a short video demonstrating the webpage controlling the LED here.*\
![Demo Video](./assets/demo-video.mp4)