import { useState } from 'react';
import { AlarmClock, Plus, X } from 'lucide-react';

export default function Schedule() {
    const [schedules, setSchedules] = useState([
        { id: 1, time: '7:00 AM', enabled: false },
        { id: 2, time: '00:00 PM', enabled: false },
        { id: 3, time: '04:00 PM', enabled: false },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newTime, setNewTime] = useState('12:00');

    const toggleSchedule = (id) => {
        setSchedules(prev => 
            prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
        );
    };

    const deleteSchedule = (id) => {
        setSchedules(prev => prev.filter(s => s.id !== id));
    };

    const addSchedule = () => {
        if (newTime) {
            const [hours, minutes] = newTime.split(':');
            const hour = parseInt(hours);
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
            const formattedTime = `${displayHour.toString().padStart(2, '0')}:${minutes} ${period}`;
            
            setSchedules(prev => [
                ...prev,
                { id: Date.now(), time: formattedTime, enabled: true }
            ]);
            setShowAddModal(false);
            setNewTime('12:00');
        }
    };

    return (
        <div className="schedule-page">
            <button className="add-schedule-btn" onClick={() => setShowAddModal(true)}>
                <Plus size={24} />
                <span>Thêm lịch</span>
            </button>

            <div className="schedule-list">
                {schedules.map(schedule => (
                    <div key={schedule.id} className="schedule-item">
                        <div className="schedule-icon">
                            <AlarmClock size={24} color="#FFFFFF" />
                        </div>
                        <span className="schedule-time">{schedule.time}</span>
                        <label className="schedule-toggle">
                            <input 
                                type="checkbox" 
                                checked={schedule.enabled}
                                onChange={() => toggleSchedule(schedule.id)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                        <button 
                            className="schedule-delete"
                            onClick={() => deleteSchedule(schedule.id)}
                        >
                            <X size={16} color="#FFFFFF" />
                        </button>
                    </div>
                ))}
            </div>

            {showAddModal && (
                <div className="schedule-modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="schedule-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="schedule-modal-title">Thêm lịch mới</h3>
                        <input 
                            type="time" 
                            className="schedule-time-input"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                        />
                        <div className="schedule-modal-actions">
                            <button 
                                className="schedule-modal-cancel"
                                onClick={() => setShowAddModal(false)}
                            >
                                Hủy
                            </button>
                            <button 
                                className="schedule-modal-confirm"
                                onClick={addSchedule}
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}