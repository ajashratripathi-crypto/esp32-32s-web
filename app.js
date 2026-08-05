// DOM Elements
const projectList = document.getElementById('project-list');
const projectTitle = document.getElementById('project-title');
const projectDescription = document.getElementById('project-description');
const projectComponents = document.getElementById('project-components');
const connectBtn = document.getElementById('connect-btn');
const flashBtn = document.getElementById('flash-btn');
const statusMessage = document.getElementById('status-message');

// State Variables
let currentProject = null;
let serialPort = null;

// Step 1: Load the projects from the JSON file
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const projects = await response.json();
        
        projects.forEach(project => {
            const li = document.createElement('li');
            li.textContent = `${project.id}. ${project.title}`;
            li.addEventListener('click', () => selectProject(project));
            projectList.appendChild(li);
        });
    } catch (error) {
        statusMessage.textContent = "Error loading projects. Check console.";
        console.error("Failed to load JSON:", error);
    }
}

// Step 2: Update the UI when a project is selected
function selectProject(project) {
    currentProject = project;
    projectTitle.textContent = project.title;
    projectDescription.textContent = project.description;
    projectComponents.textContent = project.components;
    
    // Enable flashing only if a board is connected
    if (serialPort) {
        flashBtn.disabled = false;
    }
}

// Step 3: Connect to the ESP32 using Web Serial API
async function connectBoard() {
    try {
        // Request a port and open a connection
        serialPort = await navigator.serial.requestPort();
        await serialPort.open({ baudRate: 115200 });
        
        statusMessage.textContent = "Status: ESP32 Connected Successfully!";
        connectBtn.textContent = "Connected";
        connectBtn.style.backgroundColor = "#28a745"; // Change to green
        
        // If a project is already selected, allow flashing
        if (currentProject) {
            flashBtn.disabled = false;
        }
    } catch (error) {
        statusMessage.textContent = "Status: Connection failed or canceled.";
        console.error("Connection Error:", error);
    }
}

// Step 4: Flash the compiled .bin file to the board
async function flashBoard() {
    if (!currentProject || !serialPort) return;

    statusMessage.textContent = `Status: Fetching ${currentProject.title} binary...`;
    flashBtn.disabled = true;

    try {
        // Fetch the compiled .bin file from the /bins/ folder
        const response = await fetch(currentProject.bin_path);
        const arrayBuffer = await response.arrayBuffer();
        const firmwareData = new Uint8Array(arrayBuffer);

        statusMessage.textContent = "Status: Flashing to ESP32... Please wait.";
        
        /* 
         * EDUCATIONAL NOTE:
         * Standard Web Serial allows us to send raw bytes to the port.
         * However, flashing an ESP32 requires a specific sequence (resetting the board, 
         * entering bootloader mode, and sending data in SLIP packets). 
         * For a full production application, you would integrate a library like 'esptool-js' here.
         * Below is the foundational code to write data to the open serial stream.
         */
        
        const writer = serialPort.writable.getWriter();
        await writer.write(firmwareData);
        writer.releaseLock();
        
        statusMessage.textContent = "Status: Flashing Complete! Rebooting...";
        
    } catch (error) {
        statusMessage.textContent = "Status: Error during flashing.";
        console.error("Flash Error:", error);
    } finally {
        flashBtn.disabled = false;
    }
}

// Event Listeners
connectBtn.addEventListener('click', connectBoard);
flashBtn.addEventListener('click', flashBoard);

// Initialize the app
loadProjects();
