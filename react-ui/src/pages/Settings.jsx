import { useState } from 'react';
import { Utensils, AlertTriangle, Calendar } from 'lucide-react';

export default function Settings() {
    const [mode, setMode] = useState('auto');
    const [notifications, setNotifications] = useState({
        general: true,
        foodLow: true,
        waterLow: false,
        scheduleReminder: false
    });
    const [foodAmount, setFoodAmount] = useState(75);

    const toggleNotification = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="settings-page">
            {/* Chế độ hoạt động */}
            <div className="settings-card">
                <h3 className="settings-card-title">Chế độ hoạt động</h3>
                <div className="mode-toggle">
                    <button 
                        className={`mode-btn left ${mode === 'auto' ? 'active' : ''}`}
                        onClick={() => setMode('auto')}
                    >
                        Tự động
                    </button>
                    <button 
                        className={`mode-btn right ${mode === 'manual' ? 'active' : ''}`}
                        onClick={() => setMode('manual')}
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
                                checked={notifications.general}
                                onChange={() => toggleNotification('general')}
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
                                checked={notifications.foodLow}
                                onChange={() => toggleNotification('foodLow')}
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
                                checked={notifications.waterLow}
                                onChange={() => toggleNotification('waterLow')}
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
                                checked={notifications.scheduleReminder}
                                onChange={() => toggleNotification('scheduleReminder')}
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
                            onChange={(e) => setFoodAmount(Number(e.target.value))}
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