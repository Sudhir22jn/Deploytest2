document.addEventListener("DOMContentLoaded", initializeChat);// Wait for the documents to be fully loaded before initializing the chat

document.getElementById("send-button").addEventListener("click", sendMessage);// Attach event listener to the send button
// document.getElementById("clear-button").addEventListener("click", clearChat);
// document.getElementById('minimize-button').addEventListener("click", minimize);
document.getElementById("user-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default form submission
        sendMessage(); // Call sendMessage function
    }
});

let isMinimized = false; // Flag to track the state of the chatbot

function initializeChat() {
    const chatDisplay = document.getElementById("chat-display");
    const welcomeMessage = `
        <div class="bot-message welcome-message">
            <img src="/static/images/SVA.jfif" alt="Chatbot Icon" class="chatbot-icon">
            Welcome to Softdel, this is SVA, your virtual assistant!<br>
            How can I assist you today?
        </div>
        <div class="bot-message">
            Don't know what to ask? Here are some suggestions:
        </div>
        <div class="options">
            <button class="option-button" onclick="handleOptionClick(this, 'products')">Products</button>
            <button class="option-button" onclick="handleOptionClick(this, 'services')">Services</button>
            <button class="option-button" onclick="handleOptionClick(this, 'about company')">About Company</button>
            <button class="option-button" onclick="handleOptionClick(this, 'contact us')">Contact Us</button>
        </div>
    `;
    chatDisplay.innerHTML = welcomeMessage; // Set the initial welcome message
}

function handleOptionClick(button, message) {
    const optionButtons = document.querySelectorAll(".option-button");

    // Disable all main option buttons
    optionButtons.forEach((btn) => {
        btn.disabled = true;
        btn.classList.remove("active-option");
    });

    // Highlight the clicked button
    button.classList.add("active-option");

    const chatDisplay = document.getElementById("chat-display");
    const currentTime = getCurrentTime();

    // Add chatbot message introducing suboptions
    if (message === "products") {
        const botResponse = createBotMessage("Here are some of our Products:");
        chatDisplay.innerHTML += botResponse;

    } else if (message === "services") {
        const botResponse = createBotMessage("Our services are designed to cater to your needs. Here are the details:");
        chatDisplay.innerHTML += botResponse;

    } else if (message === "about company") {
        const botResponse = createBotMessage("Let me share some information about our company. Softdel is a leading technology company specializing in IoT, smart building solutions, and protocol engineering:");
        chatDisplay.innerHTML += botResponse;

    } else if (message === "contact us") {
         const contactMsg = `You can reach us at:<br>
                        Email: info@softdel.com<br>
                        Phone: +91-20 6701 0001<br>
                        Address: www.softdel.com
Softdel Systems Private Limited
3rd Floor, Pentagon P4 Magarpatta City, Hadapsar, Pune, Maharashtra 411028, India.`;
            chatDisplay.innerHTML += `
            <div>
                <div class="user-message mb-0" style="display: flex; align-items: flex-start; gap: 10px;">
                    <div class="ai-response-container mb-0" style="text-align: left;">
                        ${option}
                    </div>
                    <div>
                        <img src="/static/images/SVA.jfif" alt="Chatbot Icon" class="chatbot-icon-in-ai-res">
                    </div>
                </div>
                <div class="time-stamp-css w-100">${currentTime}</div>
            </div>`;
            chatDisplay.innerHTML += createBotMessage(contactMsg, new Date().toLocaleTimeString());
    }

    // Display suboptions
    let subOptionsHTML = "";
    if (message === "products") {
        subOptionsHTML = `
            <div class="suboptions">
                <button class="option-button" onclick="handleSubOptionClickWithDisable(this,'Communication protocol stacks')">Communication protocol stacks</button>
                <button class="option-button" onclick="handleSubOptionClickWithDisable(this,'IoT Gateway & Platform')">IoT Gateway & Platform</button>
                <button class="option-button" onclick="handleSubOptionClickWithDisable(this,'BACnet Simulator')">BACnet Simulator</button>
            </div>`;
    } else if (message === "services") {
        subOptionsHTML = `
            <div class="suboptions">
                <button class="option-button" onclick="handleSubOptionClickWithDisable(this,'Product Engineering')">Product Engineering</button>
                <button class="option-button" onclick="handleSubOptionClickWithDisable(this,'Quality Engineering')">Quality Engineering</button>
                <button class="option-button" onclick="handleSubOptionClickWithDisable(this,'Centers of Excellence')">Center of Excellence</button>
            </div>`;
    }
      chatDisplay.innerHTML += subOptionsHTML;

    // Scroll to the bottom of the chat
      chatDisplay.scrollTop = chatDisplay.scrollHeight;
}
function handleSubOptionClickWithDisable(buttonx, messagex) {
    alert('Funciton working correct');
    // Disable all buttons inside the same parent container
    const siblingButtons1 = buttonx.parentElement.querySelectorAll("button");
    siblingButtonsx.forEach(btn => btn.disabled = true);

    // Call your original function
    handleSubOptionClick(messagex);
}
function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") return; // Do nothing for empty input

    const chatDisplay = document.getElementById("chat-display");
    const currentTime = getCurrentTime();

    // Display user message
    chatDisplay.innerHTML += `
    <div>
        <div class="user-message mb-0" style="display: flex; align-items: flex-start; gap: 10px;">
            <div class="ai-response-container mb-0" style="text-align: left;">
                ${userInput}
            </div>
            <div>
                <img src="/static/images/SVA.jfif" alt="Chatbot Icon" class="chatbot-icon-in-ai-res">
            </div>
        </div>
        <div class="time-stamp-css w-100">${currentTime}</div>
    </div>
    `;

    // Show typing indicator
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("bot-message");
    typingIndicator.id = "typing-indicator";
    typingIndicator.textContent = "Chatbot is typing...";
    chatDisplay.appendChild(typingIndicator);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;

    // Send the message to the server
    fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_input: userInput }),
    })
        .then((response) => response.json())
        .then((data) => {
            setTimeout(() => {
                // Remove typing indicator
                const typingIndicator = document.getElementById("typing-indicator");
                if (typingIndicator) chatDisplay.removeChild(typingIndicator);

                // Display bot response
                const responseTime = getCurrentTime();
                chatDisplay.innerHTML += `
                <div>
                    <div class="bot-message mb-0" style="display: flex; align-items: flex-start; gap: 10px;">
                        <div>
                            <img src="/static/images/SVA.jfif" alt="Chatbot Icon" class="chatbot-icon-in-ai-res">
                        </div>
                        <div class="ai-response-container mb-0" style="text-align: left;">
                            ${data.response}
                        </div>
                    </div>
                    <div class="time-stamp-css w-85">${currentTime}</div>
                </div>`;

                // Scroll to the bottom of chat display
                chatDisplay.scrollTop = chatDisplay.scrollHeight;
            }, 1000); // Simulate delay
        })
        .catch((error) => {
            console.error("Error:", error);

            // Display error message
            chatDisplay.innerHTML += `
            <div>
                <div class="bot-message mb-0" style="display: flex; align-items: flex-start; gap: 10px;">
                    <div>
                        <img src="/static/images/SVA.jfif" alt="Chatbot Icon" class="chatbot-icon-in-ai-res">
                    </div>
                    <div class="ai-response-container mb-0" style="text-align: left;">
                        Sorry, an error occurred. Please try again later.
                    </div>
                </div>
                <div class="time-stamp-css w-85">${currentTime}</div>
            </div>`;
        });

    // Clear the input field
    document.getElementById("user-input").value = "";
}

function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes} ${ampm}`;
}

function clearChat() {
    const chatDisplay = document.getElementById("chat-display");
    chatDisplay.innerHTML = ""; // Clear chat messages
    initializeChat(); // Reload the initial welcome message
}
function minimize() {
    if (!isMinimized) {
        const chatContainer = document.getElementById("chat-container");
        chatContainer.style.position = "fixed";
        chatContainer.style.bottom = "10px"; // Positioning at the bottom
        chatContainer.style.right = "10px"; // Positioning at the right
        chatContainer.style.width = "50px"; // Adjust width for icon
        chatContainer.style.height = "50px"; // Adjust height for icon
        chatContainer.innerHTML = `<img src="/static/images/SVA.jfif" alt="Chatbot Icon" style="width: 50px; height: 50px;">`; // Update with your chatbot icon

        isMinimized = true; // Update state
    }
}


// 🔹 New helper function that disables all sibling buttons once one is clicked
function handleSubSubOptionClickWithDisable(button, message) {
    // Disable all buttons inside the same parent container
    const siblingButtons = button.parentElement.querySelectorAll("button");
    siblingButtons.forEach(btn => btn.disabled = true);

    // Call your original function
    handleSubSubOptionClick(message);
}

function handleSubSubOptionClick(option) {
    const chatDisplay = document.getElementById("chat-display");
    const currentTime = getCurrentTime();

    // Display the selected sub-suboption with detailed information
    let info = "";
    if (option === "BACnet Stack – softBAC") {
        info = "BACnet Stack – softBAC: A robust and reliable protocol stack for BACnet communication, designed for seamless integration and high performance in building automation systems.";
    } else if (option === "Modbus Stack – SoftMOD") {
        info = "Modbus Stack – SoftMOD:A flexible and efficient Modbus protocol stack, supporting both RTU and TCP/IP for industrial automation applications.";
    } else if (option === "HART Stack – softHARTKNX Protocol") {
        info = "HART Stack – softHARTKNX Protocol: A versatile communication stack enabling two-way digital communication over 4-20mA signals, ideal for smart field instruments in industrial automation.";
    } else if (option === "DMX Stack – SoftDMX") {
        info = "DMX Stack – SoftDMX: A high-performance protocol stack for DMX communication, tailored for lighting and entertainment control systems.";
    } else if (option === "EdificeEdge – IoT Gateway") {
        info = "EdificeEdge – IoT Gateway: A powerful gateway solution that bridges devices and enterprise systems, enabling seamless IoT connectivity and data integration.";
    } else if (option === "EdificePlus - Enterprise Platform") {
        info = "EdificePlus - Enterprise Platform: A scalable platform offering advanced analytics and device management for enterprise IoT ecosystems.";
    } else if (option === "BOSS – BACnet Over IP Simulation System") {
        info = "BOSS – BACnet Over IP Simulation System:A comprehensive simulation tool for BACnet over IP, allowing testing and validation of BACnet devices and systems.";
    } else if (option === "Device Engineering") {
        info = "Device Engineering:Softdel specializes in product design and engineering, helping clients reduce time-to-market and costs. Their expertise spans hardware design, embedded software, testing, and deployment, enabling manufacturers and OEMs to create smart, connected, and IoT-ready products. Services include SoC multilayer boards and SOM-based carrier boards for application processors and microcontrollers.";
    } else if (option === "IoT Solutions and Services") {
        info = "IoT Solutions and Services:Softdel provides IoT design, consulting, development, and integration services, enabling global product companies and OEMs to innovate faster. Their future-ready solutions focus on advanced controls, connectivity, and digital transformation, helping clients create cutting-edge, smart, and connected products.";
    } else if (option === "Platform Engineering") {
        info = "Platform Engineering:Softdel’s platform engineering services help organizations deliver scalable, cloud-native platforms. By addressing IoT lifecycle challenges, they connect devices and enterprises to create customer-focused solutions. ";
    } else if (option === "Managed Services") {
        info = "Managed Services: Softdel's managed services ensure scalable, adaptable IT infrastructure tailored to business needs. They handle daily operations with expertise in areas like cloud management, SaaS, hardware, data analytics, DevOps, network security, and technical support, ensuring professional excellence.";
    } else if (option === "Industry 4.0") {
        info = "Industry 4.0: Softdel’s expertise with technologies driving Industry 4.0, including AI and machine learning, digital twin technology, cloud computing, IoT, edge computing, and more, help accelerate speed to insights across the industrial lifecycle — from conceptual and engineering design to performance optimisation.";
    } else if (option === "Custom Application Development") {
        info = "Custom Application Development:Our Offerings with Softdel’s custom application development services, you receive a powerful solution tailored precisely to your needs, crafted to support your business’s vision and growth trajectory. Leveraging deep technical expertise and a customer-focused approach, we deliver end-to-end solutions that integrate seamlessly into your existing infrastructure.";
    } else if (option === "Testing Services") {
        info = "Testing Services: Softdel offers specialised holistic testing services from the edge to the cloud, providing faultless and secure solutions. we employ modern methodologies like agile or traditional software development life cycle (SDLC) to perform quality assurance (QA) for test planning, trace ability, evidence recording, and defect reporting.";
    } else if (option === "IoT Labs") {
        info = "IoT Labs: Softdel’s expertise with technologies driving Industry 4.0, including AI and machine learning, digital twin technology, cloud computing, IoT, edge computing, and more, help accelerate speed to insights across the industrial lifecycle — from conceptual and engineering design to performance optimisation.";
    } else if (option === "Functional Safety & Compliance") {
        info = "Functional Safety & Compliance:Softdel provides end-to-end testing and certification services, including pre-assessment, gap analysis, and complete compliance testing. We guide you through technical challenges, ensuring your products meet industry-standard compliance requirements and gain access to global markets. We assist customers across diverse product categories throughout the entire certification process." ;
    } else if (option === "Data Analytics & AI") {
        info = "Data Analytics & AI: Softdel offers comprehensive data lifecycle services, including acquisition, aggregation, governance, analytics, and visualization. Leveraging AI and domain expertise, they build intelligent systems to extract value from data, prioritize use cases, and connect the unconnected.";
    } else if (option === "Cloud") {
        info = "Cloud:Softdel provides advanced cloud services to help businesses integrate their IT and OT business models to enable them to make better business decisions.";
    } else if (option === "Mobile") {
        info = "Mobile: Softdel develops tailored mobile applications by combining different data exchange and data processing mediums backed by our in-depth understanding of business requirements. we provide a wide range of mobile app development services, including multi-platform operations, easy device interfacing, data analysis, and reporting.";
    } else if (option === "UI/UX") {
        info = "UI/UX: Our UI/UX services are tailored to deliver functional and aesthetically pleasing designs that put the user at the center of the development process. We employ a mix of research, creativity, and the latest design practices to craft experiences that resonate with your audience. ";
    } else if (option === "BACnet") {
        info = "BACnet:With our extensive BACnet expertise and experience of 15+ years, we provide holistic services for BACnet enabled solutions, ensuring BACnet compliance and interoperability between devices and systems. We guide OEMs and enterprises through their Buildings-IoT journey, supporting high growth business models and market needs, and enabling a seamless transition to BACnet-enabled solutions.";
    } else {
        info = `Sorry, no additional information is available for "${option}".`;
    }

    // Add the information to the chat display
    chatDisplay.innerHTML += `
    <div>
        <div class="user-message mb-0" style="display: flex; align-items: flex-start; gap: 10px;">
            <div class="ai-response-container mb-0" style="text-align: left;">
                ${option}
            </div>
            <div>
                <img src="/static/images/SVA.jfif" alt="Chatbot Icon" class="chatbot-icon-in-ai-res">
            </div>
        </div>
        <div class="time-stamp-css w-100">${currentTime}</div>
    </div>`;
    chatDisplay.innerHTML += `
    <div>
        <div class="bot-message mb-0" style="display: flex; align-items: flex-start; gap: 10px;">
            <div>
                <img src="/static/images/SVA.jfif" alt="Chatbot Icon" class="chatbot-icon-in-ai-res">
            </div>
            <div class="ai-response-container mb-0" style="text-align: left;">
                ${info}
            </div>
        </div>
        <div class="time-stamp-css w-85">${currentTime}</div>
    </div>`;

    // Scroll to the bottom of the chat
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}
function handleSubOptionClickWithDisable(button, message) {
    // Disable all buttons inside the same parent container
    const siblingButtons1 = button.parentElement.querySelectorAll("button");
    siblingButtons1.forEach(btn => btn.disabled = true);

    // Call your original function
    handleSubOptionClick(message);
}
function createBotMessage(message) {
    const currentTime = getCurrentTime();
    return `
        <div>
            <div class="bot-message mb-0" style="display: flex; align-items: flex-start; gap: 10px;">
                <div>
                    <img src="/static/images/SVA.jfif" alt="Chatbot Icon" class="chatbot-icon-in-ai-res">
                </div>
                <div class="ai-response-container mb-0" style="text-align: left;">
                    ${message}
                </div>
            </div>
            <div class="time-stamp-css w-85">${currentTime}</div>
        </div>
    `;
}

function handleSubOptionClick(message) {
    const chatDisplay = document.getElementById("chat-display");
    const currentTime = getCurrentTime();

    // Add the user's selected suboption
    chatDisplay.innerHTML += `
    <div>
        <div class="user-message mb-0" style="display: flex; align-items: flex-start; gap: 10px;">
            <div class="ai-response-container mb-0" style="text-align: left;">
                ${message}
            </div>
            <div>
                <img src="/static/images/SVA.jfif" alt="Chatbot Icon" class="chatbot-icon-in-ai-res">
            </div>
        </div>
        <div class="time-stamp-css w-100">${currentTime}</div>
    </div>

    `;

    let optionsHTML = "";

    if (message === "Communication protocol stacks") {
        optionsHTML = `
        <div>
        <div class="bot-message mb-0" style="display: flex; align-items: flex-start; gap: 10px;">
            <div>
               <img src="/static/images/SVA.jfif" alt="Chatbot Icon" class="chatbot-icon-in-ai-res">
            </div>
            <div class="ai-response-container mb-0" style="text-align: left;">
                Here are some quality options for Communication protocol stacks:
            </div>
        </div>
        <div class="time-stamp-css w-85">
         ${currentTime}
        </div>

        <div class="sub-suboptions">
            <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'BACnet Stack – softBAC')">BACnet Stack – softBAC</button>
            <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'Modbus Stack – SoftMOD')">Modbus Stack – SoftMOD</button>
            <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'HART Stack – softHARTKNX Protocol')">HART Stack – softHARTKNX Protocol</button>
            <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'DMX Stack – SoftDMX')">DMX Stack – SoftDMX</button>
        </div>`;
    } else if (message === "IoT Gateway & Platform") {
        optionsHTML = `
        <div>
        <div class="bot-message mb-0" style="display: flex; align-items: flex-start; gap: 10px;">
            <div>
               <img src="/static/images/SVA.jfif" alt="Chatbot Icon" class="chatbot-icon-in-ai-res">
            </div>
            <div class="ai-response-container mb-0" style="text-align: left;">
                Here are some quality options for IoT Gateway & Platform:
            </div>
        </div>
        <div class="time-stamp-css w-85">
         ${currentTime}
        </div>


        <div class="sub-suboptions">
            <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'EdificeEdge – IoT Gateway')">EdificeEdge – IoT Gateway</button>
            <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'EdificePlus - Enterprise Platform')">EdificePlus - Enterprise Platform</button>
        </div>`;
    } else if (message === "BACnet Simulator") {
        optionsHTML = `
        <div>
        <div class="bot-message mb-0"  >
            <div>
                <img src="/static/images/SVA.jfif" alt="Chatbot Icon" class="chatbot-icon-in-ai-res">
            </div>
            <div class="ai-response-container text-align-right mb-0" style ={{textAlign: left}}>
                Here are some quality options for BACnet Simulator:
            </div>
        </div>
        <div class='time-stamp-css w-85' >
        ${currentTime}
        </div>
        </div>

        <div class="sub-suboptions">
            <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'BOSS – BACnet Over IP Simulation System')">BOSS – BACnet Over IP Simulation System</button>
        </div>`;
    } else if (message === "Product Engineering") {
        optionsHTML = `

        <div>
        <div class="bot-message mb-0"  >
            <div>
                <img src="/static/images/SVA.jfif" alt="Chatbot Icon" class="chatbot-icon-in-ai-res">
            </div>
            <div className="ai-response-container mb-0" style={{ textAlign: "left" }}>
               Here are some quality options for Product Engineering:
            </div>

        </div>
        <div class='time-stamp-css w-85' >
        ${currentTime}
        </div>
        </div>
        <div class="sub-suboptions">
            <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'Device Engineering')">Device Engineering</button>
            <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'IoT Solutions and Services')">IoT Solutions and Services</button>
            <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'Platform Engineering')">Platform Engineering</button>
            <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'Managed Services')">Managed Services</button>
            <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'Industry 4.0')">Industry 4.0</button>
            <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'Custom Application Development')">Custom Application Development</button>
        </div>`;
    } else if (message === "Quality Engineering") {
        optionsHTML = `
        <div>
        <div class="bot-message mb-0"  >
            <div>
                <img src="/static/images/SVA.jfif" alt="Chatbot Icon" class="chatbot-icon-in-ai-res">
            </div>
            <div className="ai-response-container mb-0" style={{ textAlign: "left" }}>
                Discover Softdel’s world-class quality services crafted to deliver excellence, innovation, and measurable impact.
            </div>

        </div>
        <div class='time-stamp-css w-85' >
        ${currentTime}
        </div>
        </div>
        <div class="sub-suboptions">
            <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'Testing Services')">Testing Services</button>
            <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'IoT Labs')">IoT Labs</button>
            <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'Functional Safety & Compliance')">Functional Safety & Compliance</button>
        </div>`;
    } else if (message === "Centers of Excellence") {
        optionsHTML = `
        <div>
            <div class="bot-message mb-0" style="display: flex; align-items: flex-start; gap: 10px;">
                <div>
                    <img src="/static/images/SVA.jfif" alt="Chatbot Icon" class="chatbot-icon-in-ai-res">
                </div>
                <div class="ai-response-container mb-0" style="text-align: left;">
                    Here are some quality options for Centers of Excellence:
                </div>
            </div>
            <div class="time-stamp-css w-85">${currentTime}</div>
        </div>
            <div class="sub-suboptions">
                <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'Data Analytics & AI')">Data Analytics & AI</button>
                <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'Cloud')">Cloud</button>
                <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'Mobile')">Mobile</button>
                <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'UI/UX')">UI/UX</button>
                <button class="suboption-button" onclick="handleSubSubOptionClickWithDisable(this,'BACnet')">BACnet</button>
            </div>
        `;
    } else {
        optionsHTML = `
        <div class="bot-message">
            <div>
                <img src="/static/images/SVA.jfif" alt="Chatbot Icon" class="chatbot-icon-in-ai-res">
            </div>
             Sorry, no further options available for "${message}".
        </div>`;
    }

    chatDisplay.innerHTML += optionsHTML;

    // Scroll to the bottom of the chat
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

//Minimize 
const minimizeBtn = document.getElementById("chatbot-minimize");
const avatar = document.getElementById("chatbot-avatar");
const chatContainer = document.getElementById("chat-container"); // ✅ use this

// When avatar is clicked → show chat & hide avatar
avatar.addEventListener("click", () => {
    chatContainer.style.display = "flex";  // show chat container
    avatar.style.display = "none";         // hide avatar
});

// When minimize button is clicked → hide chat & show avatar
minimizeBtn.addEventListener("click", () => {
    chatContainer.style.display = "none";  // hide chat container
    avatar.style.display = "flex";         // show avatar
});