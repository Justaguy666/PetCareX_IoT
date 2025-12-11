import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

console.log('🔑 GEMINI_API_KEY loaded:', process.env.GEMINI_API_KEY ? 'Yes ✓' : 'No ✗');

const genAI = process.env.GEMINI_API_KEY 
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

console.log('🤖 Gemini AI initialized:', genAI ? 'Yes ✓' : 'No (using mock) ✗');

const SYSTEM_PROMPT = `Bạn là trợ lý AI của PetCareX - ứng dụng chăm sóc thú cưng thông minh.
Bạn giúp người dùng:
- Quản lý lịch cho ăn thú cưng
- Theo dõi sức khỏe thú cưng
- Tư vấn dinh dưỡng và chăm sóc
- Hướng dẫn sử dụng thiết bị IoT PetCareX
- Trả lời các câu hỏi về thú cưng

Hãy trả lời ngắn gọn, thân thiện bằng tiếng Việt.`;

const chatHistories = new Map();

// POST /api/chat
router.post('/', async (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!genAI) {
            const mockResponses = [
                'Xin chào! Tôi là trợ lý AI của PetCareX. Tôi có thể giúp bạn quản lý lịch cho ăn, theo dõi sức khỏe thú cưng và nhiều hơn nữa!',
                'Để thiết lập lịch cho ăn tự động, bạn vào mục "Lịch trình" và tạo lịch mới nhé!',
                'Thú cưng của bạn cần được cho ăn đều đặn. Mèo nên ăn 2-3 bữa/ngày, chó nên ăn 2 bữa/ngày.',
                'Tôi có thể giúp bạn theo dõi lượng thức ăn và nước uống hàng ngày của thú cưng.',
                'Nếu có thắc mắc về sức khỏe thú cưng, hãy hỏi tôi nhé!'
            ];
            
            const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
            
            return res.json({
                response: randomResponse,
                sessionId,
                timestamp: new Date().toISOString()
            });
        }

        if (!chatHistories.has(sessionId)) {
            chatHistories.set(sessionId, []);
        }
        const history = chatHistories.get(sessionId);

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }]
            })),
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        const fullMessage = history.length === 0 
            ? `${SYSTEM_PROMPT}\n\nNgười dùng: ${message}`
            : message;

        const result = await chat.sendMessage(fullMessage);
        const response = result.response.text();

        history.push({ role: 'user', content: message });
        history.push({ role: 'model', content: response });

        if (history.length > 20) {
            history.splice(0, history.length - 20);
        }

        res.json({
            response,
            sessionId,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        
        const mockResponses = [
            'Xin chào! Tôi là trợ lý AI của PetCareX. Tôi có thể giúp bạn quản lý lịch cho ăn, theo dõi sức khỏe thú cưng và nhiều hơn nữa!',
            'Để thiết lập lịch cho ăn tự động, bạn vào mục "Lịch trình" và tạo lịch mới nhé!',
            'Thú cưng của bạn cần được cho ăn đều đặn. Mèo nên ăn 2-3 bữa/ngày, chó nên ăn 2 bữa/ngày.',
            'Tôi có thể giúp bạn theo dõi lượng thức ăn và nước uống hàng ngày của thú cưng.',
            'Nếu có thắc mắc về sức khỏe thú cưng, hãy hỏi tôi nhé!',
            'PetCareX giúp bạn tự động hóa việc chăm sóc thú cưng với thiết bị IoT thông minh.',
            'Bạn có thể xem lịch sử cho ăn trong mục "Lịch sử" để theo dõi thói quen ăn uống của thú cưng.'
        ];
        
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        
        res.json({
            response: randomResponse,
            sessionId: req.body.sessionId || 'default',
            timestamp: new Date().toISOString(),
            isMock: true // Đánh dấu là mock response
        });
    }
});

router.delete('/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    chatHistories.delete(sessionId);
    res.json({ message: 'Chat history cleared' });
});

export default router;
