const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class Esp32Service {
    async getWaterLevel() {
        const response = await fetch(`${API_URL}/esp32/water-level`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error fetching water level: ${response.status}`);
        }

        return await response.json();

    }

    async getFoodLevel() {
        const response = await fetch(`${API_URL}/esp32/food-level`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error fetching food level: ${response.status}`);
        }

        return await response.json();

    }

    async sendFoodCommand() {
        const response = await fetch(`${API_URL}/esp32/food`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error sending food command: ${response.status}`);
        }

        return await response.json();   

    }

    async sendWaterCommand() {
        const response = await fetch(`${API_URL}/esp32/water`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error sending water command: ${response.status}`);
        }

        return await response.json();

    }

    async toggleAutoMode(mode) {
        const response = await fetch(`${API_URL}/esp32/toggle-auto`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mode }),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error toggling auto mode: ${response.status}`);
        }

        return await response.json();

    }

    async changeFoodAmount(amount) {
        const response = await fetch(`${API_URL}/esp32/food-amount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount }),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error changing food amount: ${response.status}`);
        }

        return await response.json();

    }

    async changeSchedule(schedule) {
        const response = await fetch(`${API_URL}/esp32/schedule`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ schedule }),
            credentials: 'include',
        });

        if (!response.ok) { 
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error changing schedule: ${response.status}`);
        }

        return await response.json();

    }
}

export default new Esp32Service();