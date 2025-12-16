import { X } from 'lucide-react';

export default function WeeklyChart({ onClose, weeklyData = [] }) {
    const data = (weeklyData && weeklyData.length === 7)
        ? weeklyData
        : [
            { day: 'T2', feedings: 0, amount: 0 },
            { day: 'T3', feedings: 0, amount: 0 },
            { day: 'T4', feedings: 0, amount: 0 },
            { day: 'T5', feedings: 0, amount: 0 },
            { day: 'T6', feedings: 0, amount: 0 },
            { day: 'T7', feedings: 0, amount: 0 },
            { day: 'CN', feedings: 0, amount: 0 },
        ];

    const maxAmount = Math.max(...data.map(d => d.amount));
    const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);
    const totalFeedings = data.reduce((sum, d) => sum + d.feedings, 0);
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
                        {data.map((item, index) => (
                            <div key={index} className="chart-bar-wrapper">
                                <div className="chart-bar-value">{item.amount}g</div>
                                <div className="chart-bar-bg">
                                    <div 
                                        className="chart-bar-fill"
                                        style={{ height: `${maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <div className="chart-bar-label">{item.day}</div>
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
