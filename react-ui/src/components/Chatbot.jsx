import { useState, useRef, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

const quickActions = [
    { emoji: '💡', label: 'Phân tích sức khỏe' },
    { emoji: 'ℹ️', label: 'Hướng dẫn sử dụng' },
    { emoji: '🍽️', label: 'Tư vấn dinh dưỡng' },
];

export default function Chatbot({ onClose, messages, isLoading, error, sendMessage, clearHistory }) {
    const [inputValue, setInputValue] = useState('');
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim() || isLoading) return;
        sendMessage(inputValue);
        setInputValue('');
    };

    const handleQuickAction = (action) => {
        if (isLoading) return;
        sendMessage(action.label);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chatbot-overlay" onClick={onClose}>
            <div className="chatbot-popup" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="chatbot-header">
                    <div className="chatbot-header-left">
                        <div className="chatbot-avatar">
                            <span>🤖</span>
                        </div>
                        <div className="chatbot-info">
                            <h3 className="chatbot-title">Trợ lý AI</h3>
                            <p className={`chatbot-status ${isLoading ? 'typing' : ''}`}>
                                {isLoading ? 'Đang trả lời...' : 'Đang hoạt động'}
                            </p>
                        </div>
                    </div>
                    <div className="chatbot-header-actions">
                        <button className="chatbot-clear" onClick={clearHistory} title="Xóa lịch sử">
                            <Trash2 size={16} color="#6B7280" />
                        </button>
                        <button className="chatbot-close" onClick={onClose}>
                            <X size={18} color="#FFFFFF" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="chatbot-messages" ref={chatContainerRef}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`chatbot-message ${msg.isBot ? 'bot' : 'user'}`}>
                            <div className="chatbot-message-bubble">
                                {msg.text}
                            </div>
                            <span className="chatbot-message-time">{msg.time}</span>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="chatbot-message bot">
                            <div className="chatbot-message-bubble typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="chatbot-input-area">
                    <div className="chatbot-input-wrapper">
                        <input
                            type="text"
                            className="chatbot-input"
                            placeholder="Nhập tin nhắn..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button 
                            className={`chatbot-send-btn ${inputValue.trim() && !isLoading ? 'active' : ''}`}
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isLoading}
                        >
                            <span>📤</span>
                        </button>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="chatbot-quick-actions">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                className={`chatbot-quick-btn ${isLoading ? 'disabled' : ''}`}
                                onClick={() => handleQuickAction(action)}
                                disabled={isLoading}
                            >
                                {action.emoji} {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}