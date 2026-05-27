import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const POLL_INTERVAL_MS = 30_000;

// ── localStorage helpers for GUEST dismiss state ──────────────────────
function getTodayKey() {
  return `mess_dismissed_${new Date().toISOString().slice(0, 10)}`;
}

function getGuestDismissed() {
  try {
    return new Set(JSON.parse(localStorage.getItem(getTodayKey()) || "[]"));
  } catch {
    return new Set();
  }
}

function guestDismiss(mealType) {
  const s = getGuestDismissed();
  s.add(mealType);
  localStorage.setItem(getTodayKey(), JSON.stringify([...s]));
}

function guestDismissAll(mealTypes) {
  const s = getGuestDismissed();
  mealTypes.forEach((m) => s.add(m));
  localStorage.setItem(getTodayKey(), JSON.stringify([...s]));
}

export default function NotificationBell() {
  const { isLoggedIn, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const prevCount = useRef(0);

  // ── Fetch notifications ──────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);

      if (isLoggedIn && token) {
        // ── Logged-in: fetch per-student unseen (DB-backed dismiss) ──
        const res = await axios.get("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data || [];
        setNotifications(data);

        if (data.length > prevCount.current && prevCount.current !== -1) {
          setAnimate(true);
          setTimeout(() => setAnimate(false), 1000);
        }
        prevCount.current = data.length;
      } else {
        // ── Guest: fetch public global notifications, filter by localStorage dismissed ──
        const res = await axios.get("/api/notifications/public");
        const allData = res.data || [];
        const dismissed = getGuestDismissed();
        const visible = allData.filter((n) => !dismissed.has(n.mealType));
        setNotifications(visible);

        if (visible.length > prevCount.current && prevCount.current !== -1) {
          setAnimate(true);
          setTimeout(() => setAnimate(false), 1000);
        }
        prevCount.current = visible.length;
      }
    } catch (err) {
      console.warn("[NotificationBell] fetch failed:", err.message);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, token]);

  // Poll on mount + every 30 s
  useEffect(() => {
    prevCount.current = -1; // reset so first load triggers bell if there are notifications
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Dismiss a single notification ────────────────────────────────────
  const handleDismiss = async (notif, e) => {
    e.stopPropagation();

    if (isLoggedIn && token) {
      // DB dismiss for logged-in users
      try {
        await axios.patch(`/api/notifications/${notif.id}/seen`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.warn("[NotificationBell] dismiss failed:", err.message);
      }
    } else {
      // localStorage dismiss for guests
      guestDismiss(notif.mealType);
    }

    setNotifications((prev) => prev.filter((n) => n.mealType !== notif.mealType));
    prevCount.current = Math.max(0, prevCount.current - 1);
  };

  // ── Dismiss all notifications ─────────────────────────────────────────
  const handleDismissAll = async () => {
    if (isLoggedIn && token) {
      try {
        await axios.patch("/api/notifications/seen-all", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.warn("[NotificationBell] dismiss-all failed:", err.message);
      }
    } else {
      guestDismissAll(notifications.map((n) => n.mealType));
    }

    setNotifications([]);
    prevCount.current = 0;
    setOpen(false);
  };

  const count = notifications.length;

  return (
    <li className="nav-item notif-wrapper" ref={dropdownRef}>
      <button
        className={`notif-bell-btn ${animate ? "notif-ring" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`${count} meal notification${count !== 1 ? "s" : ""}`}
        title="Meal Notifications"
      >
        <span className="notif-bell-icon">🔔</span>
        {count > 0 && <span className="notif-badge">{count}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            <span>🍽️ Meal Notifications</span>
            {count > 0 && (
              <button className="notif-clear-all" onClick={handleDismissAll}>
                Clear all
              </button>
            )}
          </div>

          {loading && notifications.length === 0 ? (
            <div className="notif-empty">
              <span className="notif-empty-icon">⏳</span>
              <p>Loading…</p>
            </div>
          ) : count === 0 ? (
            <div className="notif-empty">
              <span className="notif-empty-icon">✅</span>
              <p>No active meal alerts</p>
              <small>Notifications appear at meal times</small>
            </div>
          ) : (
            <ul className="notif-list">
              {notifications.map((notif) => (
                <li key={notif.mealType} className="notif-item">
                  <span className="notif-item-emoji">{notif.emoji}</span>
                  <div className="notif-item-body">
                    <strong>{notif.title}</strong>
                    <p>{notif.message}</p>
                  </div>
                  <button
                    className="notif-dismiss"
                    onClick={(e) => handleDismiss(notif, e)}
                    title="Mark as seen"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="notif-dropdown-footer">
            <small>
              {isLoggedIn
                ? "Sent by server at each meal time • refreshes every 30 s"
                : "Today's meal announcements • dismissed until tomorrow"}
            </small>
          </div>
        </div>
      )}
    </li>
  );
}
