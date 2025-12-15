import { useState, useEffect } from 'react';
import { AlarmClock, Plus, X } from 'lucide-react';
import userService from '../services/userService';

export default function Schedule() {
    const [schedules, setSchedules] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTime, setNewTime] = useState('12:00');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const res = await userService.getSchedules();
            setSchedules(res.schedule || []);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSchedule = async (time, currentEnabled) => {
        try {
            await userService.updateSchedule(time, null, !currentEnabled);
            setSchedules(prev => 
                prev.map(s => s.time === time ? { ...s, enabled: !currentEnabled } : s)
            );
        } catch (error) {
            console.error('Error toggling schedule:', error);
        }
    };

    const deleteSchedule = async (time) => {
        try {
            await userService.deleteSchedule(time);
            setSchedules(prev => prev.filter(s => s.time !== time));
        } catch (error) {
            console.error('Error deleting schedule:', error);
        }
    };

    const addSchedule = async () => {
        if (newTime) {
            try {
                const res = await userService.createSchedule(newTime);
                setSchedules(res.schedule || []);
                setShowAddModal(false);
                setNewTime('12:00');
            } catch (error) {
                console.error('Error adding schedule:', error);
                alert(error.message);
            }
        }
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        return `${displayHour.toString().padStart(2, '0')}:${minutes} ${period}`;
    };

    if (loading) {
        return <div className="schedule-page"><p>Đang tải...</p></div>;
    }

    return (
        <div className="schedule-page">
            <button className="add-schedule-btn" onClick={() => setShowAddModal(true)}>
                <Plus size={24} />
                <span>Thêm lịch</span>
            </button>

            <div className="schedule-list">
                {schedules.map((schedule, index) => (
                    <div key={index} className="schedule-item">
                        <div className="schedule-icon">
                            <AlarmClock size={24} color="#FFFFFF" />
                        </div>
                        <span className="schedule-time">{formatTime(schedule.time)}</span>
                        <label className="schedule-toggle">
                            <input 
                                type="checkbox" 
                                checked={schedule.enabled}
                                onChange={() => toggleSchedule(schedule.time, schedule.enabled)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                        <button 
                            className="schedule-delete"
                            onClick={() => deleteSchedule(schedule.time)}
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