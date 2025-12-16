const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ChatbotService {
    constructor() {
        this.conversationId = null;
    }

    async sendMessage(message) {        
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/chatbot`, {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Chat API Error: ${response.status}`);
        }

        return await response.json();
    }

    async clearConversation() {
        return Promise.resolve();
    }
}

export default new ChatbotService();
