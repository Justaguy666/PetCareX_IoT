const API_URL = import.meta.env.VITE_DIFY_API_URL || 'https://api.dify.ai/v1';
const API_KEY = import.meta.env.VITE_DIFY_API_KEY;

class ChatbotService {
    constructor() {
        this.conversationId = null;
        this.userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    async sendMessage(message) {
        const response = await fetch(`${API_URL}/chat-messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: {},
                query: message,
                response_mode: 'blocking',
                conversation_id: this.conversationId || '',
                user: this.userId,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.conversation_id) {
            this.conversationId = data.conversation_id;
        }

        return {
            answer: data.answer,
            conversationId: data.conversation_id,
            messageId: data.message_id,
        };
    }

    async clearConversation() {
        this.conversationId = null;
        this.userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    getConversationId() {
        return this.conversationId;
    }
}

export const chatbotService = new ChatbotService();
export default chatbotService;
