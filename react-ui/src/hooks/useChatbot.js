import { useState, useCallback } from 'react';
import chatbotService from '../services/chatbotServices';

export default function useChatbot() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: 'Xin chào! Tôi là trợ lý AI của PetCareX. Tôi có thể giúp gì cho bạn hôm nay?',
            isBot: true,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = useCallback(async (text) => {
        if (!text.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: text.trim(),
            isBot: false,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const response = await chatbotService.sendMessage(text.trim());

            const botMessage = {
                id: Date.now() + 1,
                text: response.answer,
                isBot: true,
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, botMessage]);

        } catch (err) {
            console.error('Chat Error:', err);
            setError(err.message);
            
            const fallbackMessage = {
                id: Date.now() + 1,
                text: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau!',
                isBot: true,
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, fallbackMessage]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearHistory = useCallback(async () => {
        await chatbotService.clearConversation();

        setMessages([
            {
                id: Date.now(),
                text: 'Xin chào! Tôi là trợ lý AI của PetCareX. Tôi có thể giúp gì cho bạn hôm nay?',
                isBot: true,
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            }
        ]);
    }, []);

    return {
        messages,
        setMessages,
        isLoading,
        error,
        sendMessage,
        clearHistory
    };
}
