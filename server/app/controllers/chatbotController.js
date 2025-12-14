import { getUserStats } from '../../services/userService.js';
import { sendToDify } from '../../services/difyService.js';
import buildStatsContext from '../../utils/buildStatsContext.js';

class ChatbotController {
    async chat(req, res) {
        try {
            const userId = req.user?.id;
            const { message } = req.body;

            if (!message) {
                return res.status(400).json({ message: 'Message is required' });
            }

            let context = '';
            if (userId) {
                const stats = await getUserStats(userId);
                context = buildStatsContext(stats);
            }

            const difyResponse = await sendToDify({
                message: context ? `${context}\n\nUser question: ${message}` : message,
                userId: userId || 'guest',
            });

            res.json({
                answer: difyResponse.answer,
            });
        } catch (error) {
            console.error('Chat error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export default new ChatbotController();
