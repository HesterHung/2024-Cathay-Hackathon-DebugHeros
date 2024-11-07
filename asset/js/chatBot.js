document.addEventListener('DOMContentLoaded', function() {
    const messagesContainer = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');
    const errorMessage = document.getElementById('error-message');

    // Replace with your actual API endpoint
    const API_URL = 'YOUR_API_ENDPOINT';
    const TIMEOUT_DURATION = 30000; // 30 seconds timeout

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
        }, 5000); // Hide error message after 5 seconds
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

            const data = await response.json();
            
            // Hide typing indicator
            hideTypingIndicator();

            // Add bot response to chat
            addMessage(data.response, false);

        } catch (error) {
            hideTypingIndicator();
            
            if (error.name === 'AbortError') {
                addMessage("I apologize, but I'm having trouble responding right now. Please try again.", false);
            } else {
                addMessage("Sorry, there was an error processing your request.", false);
            }
            
            showErrorMessage();
            console.error('Error:', error);

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

    // Retry mechanism
    let retryCount = 0;
    const MAX_RETRIES = 3;

    async function sendMessageWithRetry() {
        for (let i = 0; i < MAX_RETRIES; i++) {
            try {
                await sendMessage();
                retryCount = 0; // Reset retry count on success
                return;
            } catch (error) {
                retryCount++;
                if (retryCount >= MAX_RETRIES) {
                    showErrorMessage();
                    retryCount = 0; // Reset retry count
                    throw error;
                }
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
            }
        }
    }

    // Initialize chat
    messageInput.focus();
});