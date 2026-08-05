# esp32-32s-web
an esp32-32s arduino ide type of website

/esp32-web-ide
│
├── index.html               (The main web page structure we created previously)
├── styles.css               (The stylesheet to make the interface look like a modern IDE)
├── app.js                   (The JavaScript logic for the UI and Web Serial connection)
├── projects.json            (The data file storing your 15 project descriptions and paths)
│
└── /bins/                   (The dedicated folder for your pre-compiled code)
    ├── project1_blink.bin
    ├── project2_traffic.bin
    ├── project3_rgb.bin
    ├── ...                  (Continue naming them up to project 15)
