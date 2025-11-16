// Fix for TypeScript errors: Property 'SpeechRecognition' and 'webkitSpeechRecognition' do not exist on type 'Window'.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import { GoogleGenAI } from "@google/genai";

// --- THEME SWITCHER ---
const themeToggles = document.querySelectorAll('.theme-toggle-btn');
const themeIcons = document.querySelectorAll('.theme-icon');

const applyTheme = (isDarkMode: boolean) => {
    document.body.classList.toggle('dark-theme', isDarkMode);
    themeIcons.forEach(icon => {
        (icon as HTMLElement).textContent = isDarkMode ? 'light_mode' : 'dark_mode';
    });
};

const toggleTheme = () => {
    const isDarkMode = !document.body.classList.contains('dark-theme');
    localStorage.setItem('dark-theme', String(isDarkMode));
    applyTheme(isDarkMode);
};

themeToggles.forEach(btn => btn.addEventListener('click', toggleTheme));

const setInitialTheme = () => {
    const isDarkMode = localStorage.getItem('dark-theme') === 'true';
    applyTheme(isDarkMode);
};


// --- STYLES ---
const style = document.createElement('style');
style.textContent = `
    :root {
        --bg-color: #f7f9fc;
        --container-bg: #ffffff;
        --text-color: #1e293b;
        --primary-color: #4f46e5;
        --primary-hover: #4338ca;
        --secondary-color: #64748b;
        --border-color: #e2e8f0;
        --shadow-color: rgba(71, 85, 105, 0.1);
        --user-msg-bg: #eef2ff;
        --bot-msg-bg: #f1f5f9;
        
        /* Calculator Light Theme (from image) */
        --calc-bg: #f7f9fc;
        --calc-display-text: #1e293b;
        --calc-btn-number-bg: #ffffff;
        --calc-btn-number-text: #1e293b;
        --calc-btn-top-bg: #eef2ff;
        --calc-btn-top-text: #4f46e5;
        --calc-btn-op-bg: #4f46e5;
        --calc-btn-op-text: #ffffff;
    }

    body.dark-theme {
        --bg-color: #020617;
        --container-bg: #1e293b;
        --text-color: #e2e8f0;
        --primary-color: #818cf8;
        --primary-hover: #a5b4fc;
        --secondary-color: #94a3b8;
        --border-color: #334155;
        --shadow-color: rgba(0, 0, 0, 0.2);
        --user-msg-bg: #3730a3;
        --bot-msg-bg: #334155;
        
        /* Calculator Dark Theme */
        --calc-bg: #000000;
        --calc-display-text: #ffffff;
        --calc-btn-number-bg: #333333;
        --calc-btn-number-text: #ffffff;
        --calc-btn-top-bg: #a5a5a5;
        --calc-btn-top-text: #000000;
        --calc-btn-op-bg: #f1a33c;
        --calc-btn-op-text: #ffffff;
    }

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: 'Roboto', sans-serif;
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
    
    body {
        background-color: var(--bg-color);
        color: var(--text-color);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        height: 100dvh; /* Dynamic viewport height */
        overflow: hidden;
    }
    
    .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        vertical-align: middle;
        user-select: none;
    }
    
    .container {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
    }

    /* --- Mobile First Layout --- */
    .agent-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--container-bg);
        z-index: 100;
        transform: translateY(-100%);
        transition: transform 0.4s ease-in-out;
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
    }
    .agent-container.visible {
        transform: translateY(0);
    }
    
    .calculator-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: var(--calc-bg);
        padding: 1rem;
    }

    .mobile-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        flex-shrink: 0;
    }

    #agent-toggle-mobile, #close-agent-btn, .theme-toggle-btn {
        background: none;
        border: none;
        color: var(--secondary-color);
        cursor: pointer;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    #agent-toggle-mobile:hover, #close-agent-btn:hover, .theme-toggle-btn:hover {
        background-color: rgba(125,125,125,0.1);
    }
    #close-agent-btn {
        color: var(--text-color);
    }


    /* Agent Shared Styles */
    .agent-container header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
    }
    
    .header-controls {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .agent-container h1 { font-size: 1.5rem; font-weight: 500; }
    
    .chat-display {
        flex-grow: 1;
        overflow-y: auto;
        padding: 0 10px;
    }
    .chat-display::-webkit-scrollbar { width: 6px; }
    .chat-display::-webkit-scrollbar-track { background: transparent; }
    .chat-display::-webkit-scrollbar-thumb { background-color: var(--border-color); border-radius: 20px; }

    .message-wrapper {
        display: flex;
        align-items: flex-end;
        gap: 0.75rem;
        max-width: 90%;
        margin-bottom: 1.25rem;
    }
    .user-message-wrapper { margin-left: auto; flex-direction: row-reverse; }
    .bot-message-wrapper { margin-right: auto; }

    .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: var(--border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    .avatar .material-symbols-outlined { color: var(--secondary-color); font-size: 24px;}


    .message {
        padding: 0.75rem 1rem;
        border-radius: 18px;
        word-wrap: break-word;
        line-height: 1.5;
    }
    .user-message {
        background-color: var(--user-msg-bg);
        color: var(--text-color); /* Dark theme needs contrasting text */
        border-bottom-right-radius: 4px;
    }
    body.dark-theme .user-message { color: #e0e7ff; }

    .bot-message {
        background-color: var(--bot-msg-bg);
        border-bottom-left-radius: 4px;
    }

    @keyframes thinking-dots {
        0%, 20% { content: '•'; }
        40%, 60% { content: '••'; }
        80%, 100% { content: '•••'; }
    }
    .bot-message.thinking::after {
        content: '•';
        animation: thinking-dots 1.4s infinite;
        display: inline-block;
        margin-left: 0.25rem;
    }

    .agent-container footer { margin-top: 1rem; }
    
    #chat-form {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    #chat-avatar-btn {
        width: 44px;
        height: 44px;
        background-color: var(--container-bg);
        border: 1px solid var(--border-color);
        cursor: pointer;
        transition: border-color 0.2s, background-color 0.2s;
    }
     #chat-avatar-btn:hover {
        background-color: var(--bot-msg-bg);
    }

    #chat-form .input-wrapper {
        flex-grow: 1;
        display: flex;
        align-items: center;
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: 28px;
        padding: 0 0.5rem;
        min-height: 52px;
        transition: border-color 0.2s;
    }

    body.dark-theme #chat-form .input-wrapper {
        background-color: var(--container-bg);
    }

    #chat-form .input-wrapper:focus-within {
        border-color: var(--primary-color);
    }

    #chat-input {
        flex-grow: 1;
        padding: 0.75rem;
        border: none;
        background-color: transparent;
        color: var(--text-color);
        font-size: 1rem;
        resize: none;
        outline: none;
        max-height: 150px;
        line-height: 1.5;
    }

    #mic-btn, #send-btn {
        border: none;
        background-color: transparent;
        color: var(--secondary-color);
        border-radius: 50%;
        cursor: pointer;
        display: flex; justify-content: center; align-items: center;
        width: 40px; height: 40px;
        flex-shrink: 0;
        transition: background-color 0.2s, color 0.2s;
    }
    #mic-btn:hover, #send-btn:hover { background-color: var(--border-color); color: var(--text-color); }
    #mic-btn.recording { color: var(--primary-color); }
    #send-btn { color: var(--primary-color); }
    #send-btn:disabled { color: var(--secondary-color); cursor: not-allowed; }

    /* Calculator Styles */
    .calculator {
        width: 100%;
        max-width: 340px;
        margin: auto;
        display: flex;
        flex-direction: column;
    }
    .calculator-title {
        font-size: 1.5rem;
        font-weight: 500;
        color: var(--secondary-color);
        margin: 0;
    }
    .desktop-title {
        display: none;
    }
    .calculator-display {
        color: var(--calc-display-text);
        font-size: 3.5rem;
        font-weight: 300;
        text-align: right;
        margin-bottom: 1.5rem;
        overflow-wrap: break-word; word-break: break-all;
        min-height: 80px;
        padding: 0 1rem;
    }
    .calculator-buttons {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.8rem;
    }
    .calculator .btn {
        font-size: 1.5rem;
        font-weight: 400;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        transition: filter 0.2s;
        display: flex; justify-content: center; align-items: center;
    }
    .calculator .btn:not(.btn-zero) {
        aspect-ratio: 1 / 1;
        height: auto;
    }
    .calculator .btn:active { filter: brightness(1.2); }
    .calculator .btn.top-row { background-color: var(--calc-btn-top-bg); color: var(--calc-btn-top-text); }
    .calculator .btn.operator { background-color: var(--calc-btn-op-bg); color: var(--calc-btn-op-text); font-size: 2rem; }
    .calculator .btn.number { background-color: var(--calc-btn-number-bg); color: var(--calc-btn-number-text); }
    .calculator .btn.btn-zero { grid-column: span 2; border-radius: 34px; justify-content: flex-start; padding-left: 24px; }
    
    /* --- Desktop Layout --- */
    @media (min-width: 800px) {
        body { padding: 1rem; }
        .container {
            display: flex;
            width: 100%;
            max-width: 1200px;
            height: 90vh;
            max-height: 850px;
            background-color: var(--container-bg);
            border-radius: 24px;
            box-shadow: 0 10px 15px -3px var(--shadow-color), 0 4px 6px -2px var(--shadow-color);
            border: 1px solid var(--border-color);
        }
        .mobile-header { display: none; }
        #close-agent-btn { display: none; }
        
        .desktop-title {
            display: block;
            text-align: center;
            margin-bottom: 1.5rem;
        }
        
        .agent-container {
            position: relative;
            flex: 1;
            transform: none;
            border-right: 1px solid var(--border-color);
        }

        .calculator-container {
            flex: 1;
            padding: 1.5rem;
        }

        .calculator { margin: auto; }
        .calculator-display { font-size: 4rem; }
        .calculator .btn { font-size: 1.8rem; }
        .calculator .btn.btn-zero { width: 100%; padding-left: 26px; }
    }
`;
document.head.appendChild(style);

// --- MOBILE VIEW TOGGLE ---
const agentContainer = document.querySelector('.agent-container') as HTMLElement;
const agentToggleBtn = document.getElementById('agent-toggle-mobile');
const agentCloseBtn = document.getElementById('close-agent-btn');
const toggleAgentView = () => agentContainer.classList.toggle('visible');
agentToggleBtn.addEventListener('click', toggleAgentView);
agentCloseBtn.addEventListener('click', toggleAgentView);

// --- AI AGENT ---
const chatDisplay = document.getElementById('chat-display');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input') as HTMLTextAreaElement;
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');

const API_KEY = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = "gemini-2.5-flash";

function typeMessage(element: HTMLElement, text: string) {
    let index = 0;
    element.textContent = '';
    const intervalId = setInterval(() => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
        } else {
            clearInterval(intervalId);
        }
    }, 20); // Typing speed
}

function addMessage(text: string, sender: 'user' | 'bot', isTyping: boolean = false): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', `${sender}-message-wrapper`);

    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    const avatarIcon = document.createElement('span');
    avatarIcon.classList.add('material-symbols-outlined');
    avatarIcon.textContent = sender === 'user' ? 'person' : 'smart_toy';
    avatar.appendChild(avatarIcon);

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);

    if (isTyping) {
        messageElement.classList.add('thinking');
    } else if (sender === 'bot') {
        // Placeholder for typing animation
    } else {
        messageElement.textContent = text;
    }

    if (sender === 'user') {
        wrapper.appendChild(messageElement);
        wrapper.appendChild(avatar);
    } else {
        wrapper.appendChild(avatar);
        wrapper.appendChild(messageElement);
    }

    chatDisplay.appendChild(wrapper);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;

    if (sender === 'bot' && !isTyping) {
        typeMessage(messageElement, text);
    }

    return messageElement;
};

const handleChatSubmit = async (e?: Event) => {
    e?.preventDefault();
    if (!API_KEY) {
        addMessage("API_KEY is not configured. Please set it up to use the AI Agent.", 'bot');
        return;
    }
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, 'user');
    chatInput.value = '';
    chatInput.style.height = 'auto';
    chatInput.dispatchEvent(new Event('input')); // Recalculate size

    sendBtn.toggleAttribute('disabled', true);
    micBtn.toggleAttribute('disabled', true);
    const thinkingMessage = addMessage('', 'bot', true);

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: userMessage,
            config: {
                systemInstruction: "You are a helpful math assistant. Keep your answers concise and accurate."
            }
        });
        thinkingMessage.classList.remove('thinking');
        typeMessage(thinkingMessage, response.text);
    } catch (error) {
        thinkingMessage.classList.remove('thinking');
        thinkingMessage.textContent = 'Oops! Something went wrong. Please try again.';
        console.error(error);
    } finally {
        sendBtn.toggleAttribute('disabled', false);
        micBtn.toggleAttribute('disabled', false);
        // Final scroll after typing animation is done, may need adjustment
        setTimeout(() => chatDisplay.scrollTop = chatDisplay.scrollHeight, 1000);
    }
};

chatForm.addEventListener('submit', handleChatSubmit);
chatInput.addEventListener('input', () => {
    // Reset height to shrink if text is deleted
    chatInput.style.height = 'auto';
    // Set height to scrollHeight
    chatInput.style.height = `${chatInput.scrollHeight}px`;
    sendBtn.toggleAttribute('disabled', chatInput.value.trim().length === 0);
});
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChatSubmit();
    }
});

// --- SPEECH RECOGNITION ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    micBtn.addEventListener('click', () => {
        micBtn.classList.contains('recording') ? recognition.stop() : recognition.start();
    });

    recognition.onstart = () => micBtn.classList.add('recording');
    recognition.onend = () => micBtn.classList.remove('recording');

    recognition.onresult = (event) => {
        chatInput.value = event.results[0][0].transcript;
        chatInput.dispatchEvent(new Event('input'));
        handleChatSubmit();
    };
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };
} else {
    (micBtn as HTMLElement).style.display = 'none';
}

// --- CALCULATOR ---
const calcDisplay = document.getElementById('calc-display');
const calcButtons = document.querySelector('.calculator-buttons');

let currentValue = '0';
let previousValue = '';
let operator = null;
let resetScreen = false;

const updateDisplay = () => {
    const valueToDisplay = currentValue.length > 12 ? parseFloat(currentValue).toExponential(5) : currentValue;
    calcDisplay.textContent = parseFloat(valueToDisplay).toLocaleString('en-US', { maximumFractionDigits: 10 });
};

const calculate = () => {
    let result;
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '×': result = prev * current; break;
        case '÷': result = prev / current; break;
        default: return;
    }
    currentValue = String(result);
    operator = null;
    previousValue = '';
};

calcButtons.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.matches('button')) return;

    const { value } = target.dataset;

    if (/\d/.test(value)) {
        if(resetScreen || currentValue === '0') currentValue = value; else currentValue += value;
        resetScreen = false;
    } else if (value === '.') {
        if(resetScreen) currentValue = '0.'; else if (!currentValue.includes('.')) currentValue += '.';
        resetScreen = false;
    } else if (value === 'AC') {
        currentValue = '0';
        previousValue = '';
        operator = null;
    } else if (value === '+/-') {
        if (currentValue !== '0') currentValue = String(parseFloat(currentValue) * -1);
    } else if (value === '%') {
        currentValue = String(parseFloat(currentValue) / 100);
        resetScreen = true;
    } else if (value === '=') {
        if (operator && previousValue) {
            calculate();
            resetScreen = true;
        }
    } else { // Operator
        if (operator && previousValue && !resetScreen) calculate();
        operator = value;
        previousValue = currentValue;
        resetScreen = true;
    }
    updateDisplay();
});

// Initialize
setInitialTheme();
updateDisplay();
sendBtn.toggleAttribute('disabled', true);
if (!API_KEY) {
    addMessage("Welcome! Please note: The AI Agent requires an API_KEY to be configured to function.", 'bot');
}
chatInput.dispatchEvent(new Event('input')); // Initial size calculation