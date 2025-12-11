import { useState, useCallback, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
    const sessionIdRef = useRef(`session_${Date.now()}`);

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
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text.trim(),
                    sessionId: sessionIdRef.current
                }),
            });

            if (!response.ok) {
                throw new Error('Không thể kết nối đến server');
            }

            const data = await response.json();

            const botMessage = {
                id: Date.now() + 1,
                text: data.response,
                isBot: true,
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, botMessage]);

        } catch (err) {
            console.error('Chat Error:', err);
            setError(err.message);
            
            // Fallback response khi không kết nối được
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
        try {
            await fetch(`${API_URL}/api/chat/${sessionIdRef.current}`, {
                method: 'DELETE',
            });
        } catch (err) {
            console.error('Clear history error:', err);
        }

        setMessages([
            {
                id: Date.now(),
                text: 'Xin chào! Tôi là trợ lý AI của PetCareX. Tôi có thể giúp gì cho bạn hôm nay?',
                isBot: true,
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            }
        ]);
        sessionIdRef.current = `session_${Date.now()}`;
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
