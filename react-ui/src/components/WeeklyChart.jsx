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

    const maxAmount = Math.max(...data.map(d => d.amount), 100);
    const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);
    const totalFeedings = data.reduce((sum, d) => sum + d.feedings, 0);
    const avgPerDay = Math.round(totalAmount / 7);

    const chartWidth = 600;
    const chartHeight = 200;
    const paddingX = 40;
    const paddingY = 30;
    const stepX = (chartWidth - paddingX * 2) / (data.length - 1);

    const points = data.map((item, index) => {
        const x = paddingX + index * stepX;
        const y = chartHeight - paddingY - ((item.amount / maxAmount) * (chartHeight - paddingY * 2));
        return { x, y, amount: item.amount };
    });

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${paddingX} ${chartHeight - paddingY} Z`;

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
                    <svg width="100%" height="250" viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ overflow: 'visible' }}>
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4].map(i => {
                            const y = chartHeight - paddingY - (i * (chartHeight - paddingY * 2) / 4);
                            const value = Math.round((maxAmount / 4) * i);
                            return (
                                <g key={i}>
                                    <line 
                                        x1={paddingX} 
                                        y1={y} 
                                        x2={chartWidth - paddingX} 
                                        y2={y} 
                                        stroke="#E5E7EB" 
                                        strokeWidth="1"
                                    />
                                    <text x={paddingX - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#6B7280">
                                        {value}g
                                    </text>
                                </g>
                            );
                        })}
                        
                        {/* Area fill */}
                        <path d={areaD} fill="rgba(59, 130, 246, 0.1)" />
                        
                        {/* Line */}
                        <path 
                            d={pathD} 
                            fill="none" 
                            stroke="#3B82F6" 
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        
                        {/* Points */}
                        {points.map((p, i) => (
                            <g key={i}>
                                <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="#3B82F6" strokeWidth="3" />
                                <text 
                                    x={p.x} 
                                    y={chartHeight - paddingY + 20} 
                                    textAnchor="middle" 
                                    fontSize="14" 
                                    fill="#374151"
                                    fontWeight="500"
                                >
                                    {data[i].day}
                                </text>
                                {p.amount > 0 && (
                                    <text 
                                        x={p.x} 
                                        y={p.y - 15} 
                                        textAnchor="middle" 
                                        fontSize="12" 
                                        fill="#3B82F6"
                                        fontWeight="600"
                                    >
                                        {p.amount}g
                                    </text>
                                )}
                            </g>
                        ))}
                    </svg>
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