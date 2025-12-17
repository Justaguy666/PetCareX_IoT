import { useState, useEffect, useCallback } from "react";
import { Utensils, Droplets, Clock, AlarmClock } from "lucide-react";
import { toast } from "react-toastify";
import userService from "../services/userService";
import esp32Service from "../services/esp32Service";

export default function Dashboard() {
  const [foodLevel, setFoodLevel] = useState(0);
  const [waterLevel, setWaterLevel] = useState(0);
  const [lastFedTime, setLastFedTime] = useState("--:--");
  const [nextFeedTime, setNextFeedTime] = useState("--:--");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const formatTimeHHMM = (dateInput) => {
    if (!dateInput) return "--:--";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "--:--";
    return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [newestRes, nextRes, foodLevelRes, waterLevelRes] =
        await Promise.all([
          userService.getNewestFeeding(),
          userService.getNextFeeding(),
          esp32Service.getFoodLevel(),
          esp32Service.getWaterLevel(),
        ]);

      const newestTime = newestRes?.feeding?.time;
      setLastFedTime(formatTimeHHMM(newestTime));

      const nextTime = nextRes?.nextFeeding?.time;
      setNextFeedTime(
        typeof nextTime === "string" && nextTime.includes(":")
          ? nextTime
          : formatTimeHHMM(nextTime)
      );

      const f = (foodLevelRes && foodLevelRes.foodLevel) || 0;
      setFoodLevel(f);

      const w = (waterLevelRes && waterLevelRes.waterLevel) || 0;
      setWaterLevel(w);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Không tải được dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFeedNow = async () => {
    try {
      setActionLoading(true);
      await esp32Service.sendFoodCommand();
      toast.success("Đã gửi lệnh cho ăn");
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Gửi lệnh cho ăn thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  const handleWaterNow = async () => {
    try {
      setActionLoading(true);
      await esp32Service.sendWaterCommand();
      toast.success("Đã gửi lệnh cho uống");
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Gửi lệnh cho uống thất bại");
    } finally {
      setActionLoading(false);
    }
  };

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
            style={{ width: `${Math.min(Math.max(foodLevel, 0), 100)}%` }}
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
            style={{ width: `${Math.min(Math.max(waterLevel, 0), 100)}%` }}
          />
        </div>
      </div>

      {/* Feed Now Button */}
      <button
        className="action-button feed-button"
        onClick={handleFeedNow}
        disabled={actionLoading}
      >
        <Utensils size={24} />
        <span>{actionLoading ? "Đang gửi..." : "Cho ăn ngay"}</span>
      </button>

      {/* Water Now Button */}
      <button
        className="action-button water-button"
        onClick={handleWaterNow}
        disabled={actionLoading}
      >
        <Droplets size={24} />
        <span>{actionLoading ? "Đang gửi..." : "Cho uống ngay"}</span>
      </button>

      {/* Last Fed Info */}
      <div className="info-card last-fed-card">
        <div className="info-icon last-fed-icon">
          <Clock size={20} color="#FFFFFF" />
        </div>
        <div className="info-content">
          <span className="info-label last-fed-label">Lần cho ăn gần nhất</span>
          <span className="info-value last-fed-value">
            {loading ? "Đang tải..." : `Đã cho ăn lúc ${lastFedTime}`}
          </span>
        </div>
      </div>

      {/* Next Feed Info */}
      <div className="info-card next-feed-card">
        <div className="info-icon next-feed-icon">
          <AlarmClock size={20} color="#FFFFFF" />
        </div>
        <div className="info-content">
          <span className="info-label next-feed-label">Lịch cho ăn tiếp theo</span>
          <span className="info-value next-feed-value">
            {loading ? "Đang tải..." : `Lần kế tiếp: ${nextFeedTime}`}
          </span>
        </div>
      </div>
    </div>
  );
}