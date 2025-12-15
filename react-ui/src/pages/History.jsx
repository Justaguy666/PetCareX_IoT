import { useState, useEffect } from 'react';
import { Utensils } from 'lucide-react';
import WeeklyChart from '../components/WeeklyChart';
import userService from '../services/userService';

export default function History() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [showChart, setShowChart] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalFeedings: 0,
        successRate: 0,
        avgAmount: 0,
        missedFeedings: 0
    });
    const [historyItems, setHistoryItems] = useState([]);
    const [weeklyReport, setWeeklyReport] = useState([]);

    useEffect(() => {
        fetchData();
        fetchWeeklyReport();
    }, []);

    const fetchData = async () => {
        try {
            const statsRes = await userService.getStatistics();
            setStats({
                totalFeedings: statsRes.totalFeedings,
                successRate: statsRes.successRate,
                avgAmount: statsRes.totalFeedings > 0 
                    ? Math.round(statsRes.totalAmount / statsRes.totalFeedings) 
                    : 0,
                missedFeedings: statsRes.missedFeedings
            });

            const settingsRes = await userService.getSchedules();
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWeeklyReport = async () => {
        try {
            const res = await userService.getWeeklyReport();
            setWeeklyReport(res.weeklyReport || []);
        } catch (error) {
            setWeeklyReport([]);
            console.error('Error fetching weekly report:', error);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Hôm nay';
        if (date.toDateString() === yesterday.toDateString()) return 'Hôm qua';
        return date.toLocaleDateString('vi-VN');
    };

    const filteredItems = historyItems.filter(item => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'success') return item.status === 'success';
        if (activeFilter === 'missed') return item.status === 'missed';
        return true;
    });

    if (loading) {
        return <div className="history-page"><p>Đang tải...</p></div>;
    }

    const getWeeklyChartData = () => {
        if (!weeklyReport || weeklyReport.length === 0) return [
            { day: 'T2', feedings: 0, amount: 0 },
            { day: 'T3', feedings: 0, amount: 0 },
            { day: 'T4', feedings: 0, amount: 0 },
            { day: 'T5', feedings: 0, amount: 0 },
            { day: 'T6', feedings: 0, amount: 0 },
            { day: 'T7', feedings: 0, amount: 0 },
            { day: 'CN', feedings: 0, amount: 0 },
        ];
        return weeklyReport.map(item => ({
            day: item.weekday,
            feedings: item.feedings,
            amount: item.amount
        }));
    };

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
                {filteredItems.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#9CA3AF' }}>Chưa có lịch sử cho ăn</p>
                ) : (
                    filteredItems.map((item, index) => (
                        <div key={index} className="history-item">
                            <div className="history-item-icon">
                                <Utensils size={18} color="#059669" />
                            </div>
                            <div className="history-item-info">
                                <span className="history-time">
                                    {new Date(item.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="history-amount">
                                    Lượng thức ăn: <strong>{item.amount}g</strong>
                                </span>
                            </div>
                            <div className="history-item-meta">
                                <span className="history-date">{formatDate(item.time)}</span>
                                <span className={`history-status ${item.status}`}>
                                    {item.status === 'success' ? 'Thành công' : 'Bỏ lỡ'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showChart && (
                <WeeklyChart 
                    onClose={() => setShowChart(false)} 
                    weeklyData={getWeeklyChartData()} 
                />
            )}
        </div>
    );
}