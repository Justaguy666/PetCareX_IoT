import { Utensils, Droplets, Clock, AlarmClock } from 'lucide-react';

export default function Dashboard() {
    const foodLevel = 75;
    const waterLevel = 75;
    const lastFedTime = "8:30 AM";
    const nextFeedTime = "7:00 PM";

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
            <button className="action-button feed-button">
                <Utensils size={24} />
                <span>Cho ăn ngay</span>
            </button>

            {/* Water Now Button */}
            <button className="action-button water-button">
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
                    <span className="info-value last-fed-value">Đã cho ăn lúc {lastFedTime}</span>
                </div>
            </div>

            {/* Next Feed Info */}
            <div className="info-card next-feed-card">
                <div className="info-icon next-feed-icon">
                    <AlarmClock size={20} color="#FFFFFF" />
                </div>
                <div className="info-content">
                    <span className="info-label next-feed-label">Lịch cho ăn tiếp theo</span>
                    <span className="info-value next-feed-value">Lần kế tiếp: {nextFeedTime}</span>
                </div>
            </div>
        </div>
    );
}