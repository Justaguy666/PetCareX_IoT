import sendMail from '../../services/mail.js';
import pushSafer from '../../services/pushSafer.js';

class NotificationController {
    sendWarningFoodMail = async (req, res) => {
        try {
            const { email } = req.body;
            if(!email) {
                return res
                    .status(400)
                    .json({ error: 'Vui lòng điền đầy đủ thông tin' });
            }
            
            const { to, subject, html } = this.foodMail(email);
            await sendMail({ to, subject, html });

            return res
                    .status(200)
                    .json({
                        success: true,
                        message: "Đã thông báo đến mail thành công",
                    })
        } catch (error) {
            console.log('[API/EMAIL/WARNINGFOODMAIL]: ', error);
            return res
                    .status(500)
                    .json({ error: 'Internal Server Error' });
        }
    }

    sendWarningWaterMail = async (req, res) => {
        try {
            const { email } = req.body;
            if(!email) {
                return res
                    .status(400)
                    .json({ error: 'Vui lòng điền đầy đủ thông tin' });
            }
            
            const { to, subject, html } = this.waterMail(email);
            await sendMail({ to, subject, html });

            return res
                    .status(200)
                    .json({
                        success: true,
                        message: "Đã thông báo đến mail thành công",
                    })
        } catch (error) {
            console.log('[API/EMAIL/WARNINGWATERMAIL]: ', error);
            return res
                    .status(500)
                    .json({ error: 'Internal Server Error' });
        }
    }

    sendWarningFoodPhone = async (req, res) => {
        try {
            const result = await pushSafer("Hệ thống phát hiện mức thức ăn dưới 20%", "⚠️ Cảnh báo thức ăn");
            const data = JSON.parse(result);
            if(data.error) {
                throw Error(data.error);
            }
            return res
                    .status(200)
                    .json({
                        success: true,
                        message: "Đã thông báo đến điện thoại thành công",
                    })
        } catch (error) {
            console.log('[API/EMAIL/WARNINGWFOODPHONE]: ', error);
            return res
                    .status(500)
                    .json({ error: 'Internal Server Error' });
        }
    }

    sendWarningWaterPhone = async (req, res) => {
        try {
            const result = await pushSafer("Hệ thống phát hiện mức nước uống dưới 20%", "⚠️ Cảnh báo nước uống");
            const data = JSON.parse(result);
            if(data.error) {
                throw Error(data.error);
            }
            return res
                    .status(200)
                    .json({
                        success: true,
                        message: "Đã thông báo đến điện thoại thành công",
                    })
        } catch (error) {
            console.log('[API/EMAIL/WARNINGWATERPHONE]: ', error);
            return res
                    .status(500)
                    .json({ error: 'Internal Server Error' });
        }
    }

    foodMail = (email) => {
        return {
            to: email,
            subject: '⚠️ Cảnh báo thức ăn',
            html: `
                    <div style="font-family: Arial, sans-serif; background:#f3f4f6; padding:20px">
                        <div style="
                            max-width:520px;
                            margin:auto;
                            background:#ffffff;
                            border-radius:8px;
                            padding:20px;
                            border-left:5px solid #f59e0b;
                        ">
                            <h3 style="margin:0 0 12px; color:#b45309">
                                ⚠️ Cảnh báo thức ăn
                            </h3>

                            <p style="margin:0 0 8px; color:#374151; font-size:14px">
                                Hệ thống phát hiện mức thức ăn dưới 
                                <strong style="color:#dc2626">20%</strong>.
                            </p>

                            <p style="margin:0; color:#374151; font-size:14px">
                                Vui lòng bổ sung thêm thức ăn để đảm bảo thú cưng của bạn không đói.
                            </p>
                        </div>
                    </div>
                `
        }
    }

    waterMail = (email) => {
        return {
            to: email,
            subject: '⚠️ Cảnh báo nước uống',
            html: `
                    <div style="font-family: Arial, sans-serif; background:#f3f4f6; padding:20px">
                        <div style="
                            max-width:520px;
                            margin:auto;
                            background:#ffffff;
                            border-radius:8px;
                            padding:20px;
                            border-left:5px solid #f59e0b;
                        ">
                            <h3 style="margin:0 0 12px; color:#b45309">
                                ⚠️ Cảnh báo nước uống
                            </h3>

                            <p style="margin:0 0 8px; color:#374151; font-size:14px">
                                Hệ thống phát hiện mức nước uống dưới 
                                <strong style="color:#dc2626">20%</strong>.
                            </p>

                            <p style="margin:0; color:#374151; font-size:14px">
                                Vui lòng bổ sung thêm nước uống để đảm bảo thú cưng của bạn không khát.
                            </p>
                        </div>
                    </div>
                `
        }
    }

    sendScheduleTentativeMail = async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ error: "Thiếu email" });
            }
    
            const mail = {
                to: email,
                subject: "⏰ Sắp đến giờ cho ăn thú cưng",
                html: `
                    <div style="font-family: Arial; padding:20px">
                        <h3>⏰ Thông báo lịch dự kiến</h3>
                        <p>
                            Hệ thống nhắc nhở:
                            <strong>15 phút nữa</strong> sẽ đến giờ cho ăn.
                        </p>
                    </div>
                `
            };
    
            await sendMail(mail);
    
            return res.status(200).json({
                success: true,
                message: "Đã gửi thông báo lịch dự kiến qua email",
            });
        } catch (error) {
            console.log("[SCHEDULE_TENTATIVE_MAIL]:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    sendScheduleTentativePhone = async (req, res) => {
        try {
            const result = await pushSafer(
                `15 phút nữa sẽ đến giờ cho ăn`,
                "⏰ Lịch cho ăn dự kiến"
            );
    
            const data = JSON.parse(result);
            if (data.error) throw Error(data.error);
    
            return res.status(200).json({
                success: true,
                message: "Đã gửi thông báo lịch dự kiến đến điện thoại",
            });
        } catch (error) {
            console.log("[SCHEDULE_TENTATIVE_PHONE]:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    sendScheduleMail = async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ error: "Thiếu email hoặc thời gian" });
            }
    
            const mail = {
                to: email,
                subject: "🍽️ Đến giờ cho ăn thú cưng",
                html: `
                    <div style="font-family: Arial; padding:20px">
                        <h3>🍽️ Thông báo cho ăn</h3>
                        <p>
                            Hiện tại đã đến giờ cho ăn theo lịch.
                        </p>
                    </div>
                `
            };
    
            await sendMail(mail);
    
            return res.status(200).json({
                success: true,
                message: "Đã gửi thông báo đến giờ cho ăn qua email",
            });
        } catch (error) {
            console.log("[SCHEDULE_NOW_MAIL]:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
    sendSchedulePhone = async (req, res) => {
        try {
            const result = await pushSafer(
                `Đã đến giờ cho ăn`,
                "🍽️ Đến giờ cho ăn"
            );
    
            const data = JSON.parse(result);
            if (data.error) throw Error(data.error);
    
            return res.status(200).json({
                success: true,
                message: "Đã gửi thông báo đến giờ cho ăn đến điện thoại",
            });
        } catch (error) {
            console.log("[SCHEDULE_NOW_PHONE]:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }    
}

export default new NotificationController();