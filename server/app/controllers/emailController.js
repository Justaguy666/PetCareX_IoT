import sendMail from '../../services/mail.js';

class EmailController {
    sendEmail = async (req, res) => {
        try {
            const { email, receiver, subject, content } = req.body;
            if(!email || !receiver || !subject || !content) {
                return res
                    .status(400)
                    .json({ error: 'Vui lòng điền đầy đủ thông tin' });
            }
        
            await sendMail({ receiver, subject, content });

            return res
                    .status(200)
                    .json({
                        success: true,
                        message: "Gửi email thành công",
                        data: {
                            messageId: info.messageId
                        }
                    })
        } catch (error) {
            console.log('[API/EMAIL/SENDEMAIL]: ', error);
            return res
                    .status(500)
                    .json({ error: 'Internal Server Error' });
        }
        
    }
}

export default new EmailController();