import User from '../models/User.js';

class UserController {
    async getNewestFeeding(req, res) {
        try {
            const userId = req.user.id;
            
            const user = await User.findById(userId, { history: { $slice: -1 } });
            
            if (!user || user.history.length === 0) {
                return res.json({ feeding: null });
            }
            
            res.json({ feeding: user.history[0] });
        } catch (e) {
            console.error('Error fetching newest feeding:', e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getNextFeeding(req, res) {
        try {
            const userId = req.user.id;
            
            const user = await User.findById(userId, { schedule: 1 });
            
            if (!user || user.schedule.length === 0) {
                return res.json({ nextFeeding: null });
            }
            
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            
            const enabledSchedules = user.schedule
                .filter(s => s.enabled)
                .sort((a, b) => a.time.localeCompare(b.time));
            
            let nextFeeding = enabledSchedules.find(s => s.time > currentTime);
            
            if (!nextFeeding && enabledSchedules.length > 0) {
                nextFeeding = enabledSchedules[0];
            }
            
            res.json({ nextFeeding });
        } catch (e) {
            console.error('Error fetching next feeding:', e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createFeedingSchedule(req, res) {
        try {
            const userId = req.user.id;
            const { time } = req.body;
            
            if (!time || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
                return res.status(400).json({ message: 'Invalid time format (HH:mm)' });
            }
            
            const user = await User.findById(userId);
            
            const exists = user.schedule.some(s => s.time === time);
            if (exists) {
                return res.status(400).json({ message: 'Schedule already exists' });
            }
            
            user.schedule.push({ time, enabled: true });
            user.schedule.sort((a, b) => a.time.localeCompare(b.time));
            await user.save();
            
            res.status(201).json({ message: 'Schedule created', schedule: user.schedule });
        } catch (e) {
            console.error('Error creating feeding schedule:', e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateFeedingSchedule(req, res) {
        try {
            const userId = req.user.id;
            const { oldTime, newTime, enabled } = req.body;
            
            const user = await User.findById(userId);
            
            const scheduleIndex = user.schedule.findIndex(s => s.time === oldTime);
            if (scheduleIndex === -1) {
                return res.status(404).json({ message: 'Schedule not found' });
            }
            
            if (newTime) {
                if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(newTime)) {
                    return res.status(400).json({ message: 'Invalid time format (HH:mm)' });
                }
                user.schedule[scheduleIndex].time = newTime;
            }
            
            if (typeof enabled === 'boolean') {
                user.schedule[scheduleIndex].enabled = enabled;
            }
            
            user.schedule.sort((a, b) => a.time.localeCompare(b.time));
            await user.save();
            
            res.json({ message: 'Schedule updated', schedule: user.schedule });
        } catch (e) {
            console.error('Error updating feeding schedule:', e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteFeedingSchedule(req, res) {
        try {
            const userId = req.user.id;
            const { time } = req.body;
            
            const result = await User.findByIdAndUpdate(
                userId,
                { $pull: { schedule: { time } } },
                { new: true }
            );
            
            res.json({ message: 'Schedule deleted', schedule: result.schedule });
        } catch (e) {
            console.error('Error deleting feeding schedule:', e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getFeedingStatistics(req, res) {
        try {
            const userId = req.user.id;
            
            const user = await User.findById(userId, { history: 1 });
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            const history = user.history || [];
            const totalFeedings = user.history.length;
            const successFeedings = user.history.filter(h => h.status === 'success').length;
            const missedFeedings = user.history.filter(h => h.status === 'missed').length;
            const totalAmount = user.history.reduce((sum, h) => sum + h.amount, 0);
            
            res.json({
                history,
                totalFeedings,
                successFeedings,
                missedFeedings,
                totalAmount,
                successRate: totalFeedings > 0 ? ((successFeedings / totalFeedings) * 100).toFixed(1) : 0
            });
        } catch (e) {
            console.error('Error fetching feeding statistics:', e);
            res.status(500).json({ message: 'Internal server error' });
        }
    } 

    async getWeeklyReport(req, res) {
        try {
            const userId = req.user.id;
            const now = new Date();
            const currentDay = now.getDay();
            const monday = new Date(now);
            monday.setDate(now.getDate() - ((currentDay + 6) % 7));
            monday.setHours(0, 0, 0, 0);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            sunday.setHours(23, 59, 59, 999);

            const user = await User.findById(userId, { history: 1 });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const weekHistory = user.history.filter(h => {
                const t = new Date(h.time);
                return t >= monday && t <= sunday;
            });

            const toLocalDateString = (date) => {
                const d = new Date(date);
                d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                return d.toISOString().split('T')[0];
            };


            const dailyData = [];
            for (let i = 0; i < 7; i++) {
                const d = new Date(monday);
                d.setDate(monday.getDate() + i);
                const dateStr = toLocalDateString(d);
                dailyData.push({
                    date: dateStr,
                    weekday: i < 6 ? `T${i+2}` : 'CN',
                    feedings: 0,
                    amount: 0,
                    success: 0,
                    missed: 0
                });
            }

            const dateToIndex = {};
            dailyData.forEach((item, idx) => { dateToIndex[item.date] = idx; });

            weekHistory.forEach(h => {
                const dateStr = toLocalDateString(h.time);
                const idx = dateToIndex[dateStr];
                if (idx !== undefined) {
                    dailyData[idx].feedings++;
                    dailyData[idx].amount += h.amount;
                    dailyData[idx][h.status]++;
                }
            });

            res.json({ weeklyReport: dailyData });
        } catch (e) {
            console.error('Error fetching weekly report:', e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getSettings(req, res) {
        try {
            const userId = req.user.id;
            
            const user = await User.findById(userId, { configurations: 1, schedule: 1 });
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json({ 
                configurations: user.configurations,
                schedule: user.schedule
            });
        } catch (e) {
            console.error('Error fetching user settings:', e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateSettings(req, res) {
        try {
            const userId = req.user.id;
            const { is_automatic, notifications, food_amount } = req.body;
            
            const updateFields = {};
            
            if (typeof is_automatic === 'boolean') {
                updateFields['configurations.is_automatic'] = is_automatic;
            }
            
            if (notifications) {
                if (typeof notifications.feeding === 'boolean') {
                    updateFields['configurations.notifications.feeding'] = notifications.feeding;
                }
                if (typeof notifications.lack_of_food === 'boolean') {
                    updateFields['configurations.notifications.lack_of_food'] = notifications.lack_of_food;
                }
                if (typeof notifications.lack_of_water === 'boolean') {
                    updateFields['configurations.notifications.lack_of_water'] = notifications.lack_of_water;
                }
                if (typeof notifications.feeding_in_next_15_minutes === 'boolean') {
                    updateFields['configurations.notifications.feeding_in_next_15_minutes'] = notifications.feeding_in_next_15_minutes;
                }
            }
            
            if (typeof food_amount === 'number' && food_amount >= 25 && food_amount <= 125) {
                updateFields['configurations.food_amount'] = food_amount;
            }
            
            const user = await User.findByIdAndUpdate(
                userId,
                { $set: updateFields },
                { new: true, select: 'configurations' }
            );
            
            res.json({ message: 'Settings updated', configurations: user.configurations });
        } catch (e) {
            console.error('Error updating user settings:', e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getUserProfile(req, res) {
        try {
            const userId = req.user.id;
            
            const user = await User.findById(userId, { username: 1, email: 1, createdAt: 1 });
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json({ user });
        } catch (e) {
            console.error('Error fetching user profile:', e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateUserProfile(req, res) {
        try {
            const userId = req.user.id;
            const { username, email } = req.body;
            
            const updateFields = {};
            
            if (username) {
                if (username.length < 6 || username.length > 20) {
                    return res.status(400).json({ message: 'Tên người dùng phải từ 6-20 kí tự' });
                }
                updateFields.username = username.trim();
            }
            
            if (email) {
                if (!/^\S+@\S+\.\S+$/.test(email)) {
                    return res.status(400).json({ message: 'Email sai định dạng' });
                }
                updateFields.email = email.toLowerCase().trim();
            }
            
            const user = await User.findByIdAndUpdate(
                userId,
                { $set: updateFields },
                { new: true, select: 'username email' }
            );
            
            res.json({ message: 'Cập nhật profile thành công', user });
        } catch (e) {
            if (e.code === 11000) {
                return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống' });
            }
            console.error('Error updating user profile:', e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new UserController();