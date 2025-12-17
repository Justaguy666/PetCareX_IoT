import { useState, useEffect } from 'react';
import { Utensils, AlertTriangle, Calendar } from 'lucide-react';
import userService from '../services/userService';
import esp32Service from '../services/esp32Service';
import { toast } from "react-toastify";

export default function Settings() {
    const [mode, setMode] = useState('manual');
    const [notifications, setNotifications] = useState({
        feeding: true,
        lack_of_food: true,
        lack_of_water: false,
        feeding_in_next_15_minutes: false
    });
    const [foodAmount, setFoodAmount] = useState(75);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await userService.getSettings();
            const config = res.configurations;
            setMode(config.is_automatic ? 'auto' : 'manual');
            setNotifications(config.notifications);
            setFoodAmount(config.food_amount);
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error("Không thể tải cài đặt. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    const handleModeChange = async (newMode) => {
        const prevMode = mode;
        setMode(newMode);

        try {
            await userService.updateSettings({ is_automatic: newMode === 'auto' });
            await esp32Service.toggleAutoMode(newMode === 'auto');
            toast.success(`Đã chuyển sang chế độ ${newMode === 'auto' ? 'Tự động' : 'Thủ công'}`);
        } catch (error) {
            console.error('Error updating mode:', error);
            setMode(prevMode);
            toast.error("Đổi chế độ thất bại. Vui lòng thử lại!");
        }
    };

    const toggleNotification = async (key) => {
        const newValue = !notifications[key];

        setNotifications(prev => ({ ...prev, [key]: newValue }));

        try {
            await userService.updateSettings({ notifications: { [key]: newValue } });
            toast.success(newValue ? "Đã bật thông báo" : "Đã tắt thông báo");
        } catch (error) {
            console.error('Error updating notification:', error);
            setNotifications(prev => ({ ...prev, [key]: !newValue }));
            toast.error("Cập nhật thông báo thất bại!");
        }
    };

    const handleFoodAmountChange = async (value) => {
        setFoodAmount(value);

        try {
            await esp32Service.changeFoodAmount(value);
        } catch (error) {
            console.error('Error changing food amount realtime:', error);
        }
    };

    const handleFoodAmountBlur = async () => {
        try {
            await userService.updateSettings({ food_amount: foodAmount });
            await esp32Service.changeFoodAmount(foodAmount);
            toast.success(`Đã lưu khẩu phần: ${foodAmount}g`);
        } catch (error) {
            console.error('Error updating food amount:', error);
            toast.error("Lưu khẩu phần thất bại!");
        }
    };

    if (loading) {
        return <div className="settings-page"><p>Đang tải...</p></div>;
    }

    return (
        <div className="settings-page">
            {/* Chế độ hoạt động */}
            <div className="settings-card">
                <h3 className="settings-card-title">Chế độ hoạt động</h3>
                <div className="mode-toggle">
                    <button 
                        className={`mode-btn left ${mode === 'auto' ? 'active' : ''}`}
                        onClick={() => handleModeChange('auto')}
                    >
                        Tự động
                    </button>
                    <button 
                        className={`mode-btn right ${mode === 'manual' ? 'active' : ''}`}
                        onClick={() => handleModeChange('manual')}
                    >
                        Thủ công
                    </button>
                </div>
            </div>

            {/* Thông báo */}
            <div className="settings-card">
                <h3 className="settings-card-title">Thông báo</h3>
                <div className="notification-list">
                    <div className="notification-item">
                        <div className="notification-icon green">
                            <Utensils size={18} color="#FFFFFF" />
                        </div>
                        <div className="notification-info">
                            <span className="notification-title">Thông báo</span>
                            <span className="notification-desc">Nhận thông báo khi đến giờ ăn/uống</span>
                        </div>
                        <label className="settings-toggle">
                            <input 
                                type="checkbox" 
                                checked={notifications.feeding}
                                onChange={() => toggleNotification('feeding')}
                            />
                            <span className="settings-toggle-slider"></span>
                        </label>
                    </div>

                    <div className="notification-item">
                        <div className="notification-icon orange">
                            <AlertTriangle size={18} color="#FFFFFF" />
                        </div>
                        <div className="notification-info">
                            <span className="notification-title">Thức ăn sắp hết</span>
                            <span className="notification-desc">Cảnh báo khi thức ăn dưới 20%</span>
                        </div>
                        <label className="settings-toggle">
                            <input 
                                type="checkbox" 
                                checked={notifications.lack_of_food}
                                onChange={() => toggleNotification('lack_of_food')}
                            />
                            <span className="settings-toggle-slider"></span>
                        </label>
                    </div>

                    <div className="notification-item">
                        <div className="notification-icon orange">
                            <AlertTriangle size={18} color="#FFFFFF" />
                        </div>
                        <div className="notification-info">
                            <span className="notification-title">Nước uống sắp hết</span>
                            <span className="notification-desc">Cảnh báo khi nước uống dưới 20%</span>
                        </div>
                        <label className="settings-toggle">
                            <input 
                                type="checkbox" 
                                checked={notifications.lack_of_water}
                                onChange={() => toggleNotification('lack_of_water')}
                            />
                            <span className="settings-toggle-slider"></span>
                        </label>
                    </div>

                    <div className="notification-item">
                        <div className="notification-icon pink">
                            <Calendar size={18} color="#FFFFFF" />
                        </div>
                        <div className="notification-info">
                            <span className="notification-title">Nhắc nhở lịch trình</span>
                            <span className="notification-desc">Thông báo trước 15 phút</span>
                        </div>
                        <label className="settings-toggle">
                            <input 
                                type="checkbox" 
                                checked={notifications.feeding_in_next_15_minutes}
                                onChange={() => toggleNotification('feeding_in_next_15_minutes')}
                            />
                            <span className="settings-toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Lượng thức ăn mặc định */}
            <div className="settings-card purple">
                <h3 className="settings-card-title">Lượng thức ăn mặc định</h3>
                <p className="food-amount-label">Khẩu phần cho mỗi lần</p>
                <div className="food-slider-container">
                    <div className="food-slider-track">
                        <div 
                            className="food-slider-fill" 
                            style={{ width: `${((foodAmount - 25) / 100) * 100}%` }}
                        ></div>
                        <input
                            type="range"
                            min="25"
                            max="125"
                            value={foodAmount}
                            onChange={(e) => handleFoodAmountChange(Number(e.target.value))}
                            onMouseUp={handleFoodAmountBlur}
                            onTouchEnd={handleFoodAmountBlur}
                            className="food-slider-input"
                        />
                    </div>
                    <div className="food-slider-labels">
                        <span>25g</span>
                        <span>75g</span>
                        <span>125g</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
