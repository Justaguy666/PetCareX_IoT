import User from "../app/models/User.js";
import sendMail from "./mail.js";
import pushSafer from "./pushSafer.js";
import { esp32Store } from "../stores/esp32Store.js";

const WARNING_PERCENT = 20;

const state = {
  lastFoodAlertAt: null,
  lastWaterAlertAt: null,
  sentScheduleKeys: new Set(),
};

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function minutesUntil(timeHHmm) {
  // timeHHmm: "HH:mm"
  const now = new Date();
  const [hh, mm] = timeHHmm.split(":").map(Number);
  const target = new Date(now);
  target.setHours(hh, mm, 0, 0);
  const diffMs = target.getTime() - now.getTime();
  return Math.round(diffMs / 60000);
}

async function notifyLowLevel(users, type, level) {
  const percent = Number(level);
  if (Number.isNaN(percent)) return;
  if (percent >= WARNING_PERCENT) return;

  const now = Date.now();
  const key = type === "food" ? "lastFoodAlertAt" : "lastWaterAlertAt";

  // Chỉ gửi khi vừa xuống dưới ngưỡng hoặc cách lần trước >= 6h
  const SIX_HOURS = 6 * 60 * 60 * 1000;
  if (state[key] && now - state[key] < SIX_HOURS) return;

  state[key] = now;

  // Gửi cho các user bật cấu hình tương ứng
  for (const user of users) {
    const cfg = user.configurations.notifications;
    if(cfg.lack_of_food && type === "food") {
      // Mail
      try {
        const email = user.email;
        const res = await fetch("http://localhost:3001/api/notification/warning/mail/food", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if(!res.ok) {
          throw Error('Không gửi thành công cảnh cáo thức ăn đến ', email);
        }
        console.log('Gửi thành công cảnh cáo thức ăn đến ', email);
      } catch (error) {
        console.error(`[SCHEDULER] PushSafer ${type} error:`, error?.message || error);
      }

      // Phone
      try {
        const res = await fetch("http://localhost:3001/api/notification/warning/phone/food", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if(!res.ok) {
          throw Error('Không gửi thành công cảnh cáo thức ăn đến điện thoại');
        }
        console.log('Gửi thành công cảnh cáo thức ăn đến điện thoại');
      } catch (error) {
        console.error(`[SCHEDULER] PushSafer ${type} error:`, error?.message || error);
      }
    } else if(cfg.lack_of_water && type === "water") {
      // Email
      try {
        const email = user.email;
        const res = await fetch("http://localhost:3001/api/notification/warning/mail/water", {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        if(!res.ok) {
          throw Error('Không gửi thành công cảnh cáo nước uống đến ', email);
        }
        console.log('Gửi thành công cảnh cáo nước uống đến ', email);
      } catch (error) {
        console.error(`[SCHEDULER] PushSafer ${type} error:`, error?.message || error);
      }

      // Phone
      try {
        const res = await fetch("http://localhost:3001/api/notification/warning/phone/water", {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        if(!res.ok) {
          throw Error('Không gửi thành công cảnh cáo nước uống đến điện thoại');
        }
        console.log('Gửi thành công cảnh cáo nước uống đến điện thoại');
      } catch (error) {
        console.error(`[SCHEDULER] PushSafer ${type} error:`, error?.message || error);
      }
    }
  }
}

function buildScheduleKey(userId, time, kind) {
  return `${userId}|${todayKey()}|${time}|${kind}`;
}

async function notifySchedules(users) {
  const now = new Date();

  for (const user of users) {
    const cfg = user.configurations;
    const notif = cfg.notifications;
    if (!Array.isArray(user.schedule) || user.schedule.length === 0) continue;

    for (const item of user.schedule) {
      if (!item.enabled) continue;
      const time = item.time; // HH:mm
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) continue;
      const diff = minutesUntil(time);
      if (notif.feeding_in_next_15_minutes && diff === 15) {
        const kPush = buildScheduleKey(user._id, time, "tentative-push");
        if (!state.sentScheduleKeys.has(kPush)) {
          try {
            const res = await fetch("http://localhost:3001/api/notification/schedule-tentative/phone", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            });
            if(!res.ok) {
              throw Error('Không gửi thành công lịch dự kiến thức ăn đến điện thoại');
            }
            console.log('Gửi lịch dự kiến về điện thoại thành công');
          } catch (e) {
            console.error("[SCHEDULER] Tentative push error:", e?.message || e);
          } finally {
            state.sentScheduleKeys.add(kPush);
          }
        }

        // Mail
        if (user.email) {
          const kMail = buildScheduleKey(user._id, time, "tentative-mail");
          if (!state.sentScheduleKeys.has(kMail)) {
            try {
              const email = user.email;
              const res = await fetch("http://localhost:3001/api/notification/schedule-tentative/mail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
              });
              if(!res.ok) {
                throw Error('Không gửi thành công lịch dự kiến thức ăn đến ', email);
              }
            } catch (e) {
              console.error("[SCHEDULER] Tentative mail error:", e?.message || e);
            } finally {
              state.sentScheduleKeys.add(kMail);
            }
          }
        }
      }

      // Đúng giờ
      if (notif.feeding && diff === 0) {
        const kPushNow = buildScheduleKey(user._id, time, "now-push");
        if (!state.sentScheduleKeys.has(kPushNow)) {
          try {
            const res = await fetch("http://localhost:3001/api/notification/schedule-now/phone", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            });
            if(!res.ok) {
              throw Error('Không gửi thành công lịch cho ăn đến điện thoại');
            }
            console.log('Gửi lịch cho ăn về điện thoại thành công');
          } catch (e) {
            console.error("[SCHEDULER] Now push error:", e?.message || e);
          } finally {
            state.sentScheduleKeys.add(kPushNow);
          }
        }

        // Mail
        if (user.email) {
          const kMailNow = buildScheduleKey(user._id, time, "now-mail");
          if (!state.sentScheduleKeys.has(kMailNow)) {
            try {
              const email = user.email;
              const res = await fetch("http://localhost:3001/api/notification/schedule-now/mail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
              });
              if(!res.ok) {
                throw Error('Không gửi thành công lịch cho ăn đến ', email);
              }
            } catch (e) {
              console.error("[SCHEDULER] Now mail error:", e?.message || e);
            } finally {
              state.sentScheduleKeys.add(kMailNow);
            }
          }
        }
      }
    }
  }
}

export function startNotificationScheduler() {
  setInterval(() => {
    state.sentScheduleKeys = new Set(
      [...state.sentScheduleKeys].filter((key) => key.includes(`|${todayKey()}|`))
    );
  }, 60 * 60 * 1000);

  setInterval(async () => {
    try {
      const users = await User.find({});

      if (esp32Store.foodLevel != null) {
        await notifyLowLevel(users, "food", esp32Store.foodLevel);
      }
      if (esp32Store.waterLevel != null) {
        await notifyLowLevel(users, "water", esp32Store.waterLevel);
      }

      // Nhắc lịch
      await notifySchedules(users);
    } catch (e) {
      console.error("[SCHEDULER] Tick error:", e);
    }
  }, 5 * 1000);
}
