import { useState, useEffect } from 'react';
import { Utensils, Droplets, Clock, AlarmClock } from 'lucide-react';
import userService from '../services/userService';
import esp32Service from '../services/esp32Service';

export default function Dashboard() {
    const [foodLevel, setFoodLevel] = useState(0);
    const [waterLevel, setWaterLevel] = useState(0);
    const [lastFedTime, setLastFedTime] = useState('--:--');
    const [nextFeedTime, setNextFeedTime] = useState('--:--');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [newestRes, nextRes, foodLevelRes, waterLevelRes] = await Promise.all([
                    userService.getNewestFeeding(),
                    userService.getNextFeeding(),
                    esp32Service.getFoodLevel(),
                    esp32Service.getWaterLevel()
                ]);

                if (newestRes.feeding) {
                    const time = new Date(newestRes.feeding.time);
                    setLastFedTime(time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
                }

                if (nextRes.nextFeeding) {
                    setNextFeedTime(nextRes.nextFeeding.time);
                }

                if (foodLevelRes.foodLevel) {
                    setFoodLevel(foodLevelRes.foodLevel);
                }

                if (waterLevelRes.waterLevel) {
                    setWaterLevel(waterLevelRes.waterLevel);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard">
            {/* Food Level Card */}
            <div className="dashboard-card food-card">
                <div className="card-header">
                    <span className="card-title food-title">Mức thức ăn còn lại</span>
                    <span className="card-percentage food-percentage">{foodLevel}%</span>
                </div>
                <div className="progress-bar food-progress-bg">
                    <div 
                        className="progress-fill food-progress-fill" 
                        style={{ width: `${foodLevel}%` }}
                    />
                </div>
            </div>

            {/* Water Level Card */}
            <div className="dashboard-card water-card">
                <div className="card-header">
                    <span className="card-title water-title">Mức nước uống còn lại</span>
                    <span className="card-percentage water-percentage">{waterLevel}%</span>
                </div>
                <div className="progress-bar water-progress-bg">
                    <div 
                        className="progress-fill water-progress-fill" 
                        style={{ width: `${waterLevel}%` }}
                    />
                </div>
            </div>

            {/* Feed Now Button */}
            <button 
                className="action-button feed-button"
                onClick={() => esp32Service.sendFoodCommand()}
            >
                <Utensils size={24} />
                <span>Cho ăn ngay</span>
            </button>

            {/* Water Now Button */}
            <button 
                className="action-button water-button"
                onClick={() => esp32Service.sendWaterCommand()}
            >
                <Droplets size={24} />
                <span>Cho uống ngay</span>
            </button>

            {/* Last Fed Info */}
            <div className="info-card last-fed-card">
                <div className="info-icon last-fed-icon">
                    <Clock size={20} color="#FFFFFF" />
                </div>
                <div className="info-content">
                    <span className="info-label last-fed-label">Lần cho ăn gần nhất</span>
                    <span className="info-value last-fed-value">
                        {loading ? 'Đang tải...' : `Đã cho ăn lúc ${lastFedTime}`}
                    </span>
                </div>
            </div>

            {/* Next Feed Info */}
            <div className="info-card next-feed-card">
                <div className="info-icon next-feed-icon">
                    <AlarmClock size={20} color="#FFFFFF" />
                </div>
                <div className="info-content">
                    <span className="info-label next-feed-label">Lịch cho ăn tiếp theo</span>
                    <span className="info-value next-feed-value">
                        {loading ? 'Đang tải...' : `Lần kế tiếp: ${nextFeedTime}`}
                    </span>
                </div>
            </div>
        </div>
    );
}