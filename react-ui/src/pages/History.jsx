import { useState } from 'react';
import { Utensils } from 'lucide-react';
import WeeklyChart from '../components/WeeklyChart';

export default function History() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [showChart, setShowChart] = useState(false);

    const stats = {
        totalFeedings: 12,
        successRate: 92,
        avgAmount: 47,
        missedFeedings: 1
    };

    const historyItems = [
        { id: 1, time: '8:30 AM', amount: 50, date: 'Hôm nay', status: 'success' },
        { id: 2, time: '6:00 PM', amount: 45, date: 'Hôm qua', status: 'success' },
        { id: 3, time: '8:30 AM', amount: 50, date: 'Hôm qua', status: 'success' },
    ];

    const filteredItems = historyItems.filter(item => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'success') return item.status === 'success';
        if (activeFilter === 'missed') return item.status === 'missed';
        return true;
    });

    return (
        <div className="history-page">
            <div className="history-stats-card">
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-value green">{stats.totalFeedings}</span>
                        <span className="stat-label">Tổng lần cho ăn</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value green">{stats.successRate}%</span>
                        <span className="stat-label">Tỷ lệ thành công</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value green">{stats.avgAmount}g</span>
                        <span className="stat-label">Lượng TB/lần</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value red">{stats.missedFeedings}</span>
                        <span className="stat-label">Lần bỏ lỡ</span>
                    </div>
                </div>
            </div>

            <div className="history-filters">
                <button 
                    className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('all')}
                >
                    Tất cả
                </button>
                <button 
                    className={`filter-btn ${activeFilter === 'success' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('success')}
                >
                    Thành công
                </button>
                <button 
                    className={`filter-btn ${activeFilter === 'missed' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('missed')}
                >
                    Bỏ lỡ
                </button>
                <button 
                    className="filter-btn chart-btn"
                    onClick={() => setShowChart(true)}
                >
                    Biểu đồ tuần qua
                </button>
            </div>

            <div className="history-list">
                {filteredItems.map(item => (
                    <div key={item.id} className="history-item">
                        <div className="history-item-icon">
                            <Utensils size={18} color="#059669" />
                        </div>
                        <div className="history-item-info">
                            <span className="history-time">{item.time}</span>
                            <span className="history-amount">
                                Lượng thức ăn: <strong>{item.amount}g</strong>
                            </span>
                        </div>
                        <div className="history-item-meta">
                            <span className="history-date">{item.date}</span>
                            <span className={`history-status ${item.status}`}>
                                {item.status === 'success' ? 'Thành công' : 'Bỏ lỡ'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {showChart && <WeeklyChart onClose={() => setShowChart(false)} />}
        </div>
    );
}