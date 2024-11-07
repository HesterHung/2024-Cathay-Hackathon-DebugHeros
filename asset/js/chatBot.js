document.addEventListener('DOMContentLoaded', function() {
    const messagesContainer = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');
    const errorMessage = document.getElementById('error-message');

    const API_URL = 'http://ec2-54-179-40-164.ap-southeast-1.compute.amazonaws.com:8000/chatbot_chatting/';
    const TIMEOUT_DURATION = 30000;

    // Clear any previous messages and typing indicator
    typingIndicator.style.display = 'none';
    messagesContainer.innerHTML = `
        <div class="message bot-message">
            <div class="message-content">
                Hello! I'm your travel assistant. How can I help you plan your journey?
            </div>
            <div class="message-time">${getCurrentTime()}</div>
        </div>
    `;

    function showTypingIndicator() {
        typingIndicator.style.display = 'block';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }

    function showErrorMessage() {
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    function getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function addMessage(message, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = getCurrentTime();

        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(timeDiv);
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // Debug log
        console.log('Sending message:', message);

        // Disable input and button while processing
        messageInput.disabled = true;
        sendButton.disabled = true;

        // Add user message to chat
        addMessage(message, true);
        messageInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Get response as text instead of JSON
            const responseText = await response.text();
            console.log('Bot response:', responseText); // Debug log

            // Hide typing indicator
            hideTypingIndicator();

            // Add bot response to chat
            addMessage(responseText, false);

        } catch (error) {
            console.error('Error:', error); // Debug log
            hideTypingIndicator();
            
            if (error.name === 'AbortError') {
                addMessage("I apologize, but I'm having trouble responding right now. Please try again.", false);
            } else {
                addMessage("Sorry, there was an error processing your request.", false);
            }
            
            showErrorMessage();

        } finally {
            // Re-enable input and button
            messageInput.disabled = false;
            sendButton.disabled = false;
            messageInput.focus();
        }
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Initialize focus
    messageInput.focus();
});