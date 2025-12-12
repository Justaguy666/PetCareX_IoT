import { X } from 'lucide-react';

export default function WeeklyChart({ onClose }) {
    const weeklyData = [
        { day: 'T2', feedings: 2, amount: 95 },
        { day: 'T3', feedings: 2, amount: 100 },
        { day: 'T4', feedings: 1, amount: 50 },
        { day: 'T5', feedings: 2, amount: 90 },
        { day: 'T6', feedings: 2, amount: 100 },
        { day: 'T7', feedings: 2, amount: 95 },
        { day: 'CN', feedings: 1, amount: 50 },
    ];

    const maxAmount = Math.max(...weeklyData.map(d => d.amount));
    const totalAmount = weeklyData.reduce((sum, d) => sum + d.amount, 0);
    const totalFeedings = weeklyData.reduce((sum, d) => sum + d.feedings, 0);
    const avgPerDay = Math.round(totalAmount / 7);

    return (
        <div className="chart-modal-overlay" onClick={onClose}>
            <div className="chart-modal" onClick={(e) => e.stopPropagation()}>
                <div className="chart-modal-header">
                    <h3 className="chart-modal-title">Biểu đồ tuần qua</h3>
                    <button className="chart-modal-close" onClick={onClose}>
                        <X size={20} color="#6B7280" />
                    </button>
                </div>
                <div className="chart-container">
                    <div className="chart-bars">
                        {weeklyData.map((data, index) => (
                            <div key={index} className="chart-bar-wrapper">
                                <div className="chart-bar-value">{data.amount}g</div>
                                <div className="chart-bar-bg">
                                    <div 
                                        className="chart-bar-fill"
                                        style={{ height: `${(data.amount / maxAmount) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="chart-bar-label">{data.day}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chart-summary">
                    <div className="chart-summary-item">
                        <span className="chart-summary-value">{totalAmount}g</span>
                        <span className="chart-summary-label">Tổng lượng</span>
                    </div>
                    <div className="chart-summary-item">
                        <span className="chart-summary-value">{totalFeedings}</span>
                        <span className="chart-summary-label">Số lần cho ăn</span>
                    </div>
                    <div className="chart-summary-item">
                        <span className="chart-summary-value">{avgPerDay}g</span>
                        <span className="chart-summary-label">TB/ngày</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
