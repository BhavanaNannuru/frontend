// context/NotificationsContext.tsx
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { Notification } from "../types";

type NotificationsContextType = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  toggleRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
};

const BASE_URL = "http://localhost:5000";
const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const mapDbToClient = (row: any): Notification => ({
    id: row.id,
    user_id: row.user_id,
    type: row.type,
    title: row.title,
    message: row.message,
    is_read: !!row.is_read,
    relatedEntityId: row.related_entity_id,
  });

 

  const fetchNotifications = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/notifications/user/${user.id}`);
      // Log the raw text of the response to see the HTML
      const dataText = await res.text();
      // console.log("Raw response text:", dataText);
  
      if (!res.ok) {
        throw new Error(`Failed to fetch notifications. Status: ${res.status}`);
      }
  
      // Now, try to parse it as JSON
      const data = JSON.parse(dataText);
      setNotifications((data || []).map(mapDbToClient));
  
    } catch (err) {
      console.error("fetchNotifications error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const refresh = fetchNotifications;

  // ---------------- Optimistic update helper ----------------
  const optimisticUpdate = (updater: (prev: Notification[]) => Notification[]) => {
    const prev = notifications;
    setNotifications(updater);
    return () => setNotifications(prev); // rollback
  };

  // ---------------- Mark single notification as read ----------------
  const markAsRead = async (id: string) => {
    const rollback = optimisticUpdate(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
    );
    try {
      const res = await fetch(`${BASE_URL}/api/notifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: true }),
      });
      if (!res.ok) throw new Error("Failed to mark as read");
    } catch (err) {
      console.error("markAsRead error", err);
      rollback();
    }
  };

  // ---------------- Toggle read/unread ----------------
  const toggleRead = async (id: string) => {
    const notif = notifications.find(n => n.id === id);
    if (!notif || !user?.id) return;
  
    const newState = !notif.is_read;
  
    const rollback = optimisticUpdate(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: newState } : n))
    );
  
    try {
      const res = await fetch(`${BASE_URL}/api/notifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_read: newState,
          user_id: user.id,  // <- Add this
        }),
      });
  
      if (!res.ok) throw new Error("Failed to toggle read state");
    } catch (err) {
      console.error("toggleRead error", err);
      rollback();
    }
  };
  

  // ---------------- Mark all as read ----------------
  const markAllAsRead = async () => {
    const rollback = optimisticUpdate(prev =>
      prev.map(n => (n.user_id === user?.id ? { ...n, is_read: true } : n))
    );
    try {
      const res = await fetch(`${BASE_URL}/api/notifications/markAllRead`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user?.id }),
      });
      if (!res.ok) throw new Error("Failed to mark all as read");
    } catch (err) {
      console.error("markAllAsRead error", err);
      rollback();
    }
  };

  // ---------------- Delete notification ----------------
  const deleteNotification = async (id: string) => {
    const rollback = optimisticUpdate(prev => prev.filter(n => n.id !== id));
    try {
      const res = await fetch(`${BASE_URL}/api/notifications/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user?.id }),
      });
      if (!res.ok) throw new Error("Failed to delete notification");
    } catch (err) {
      console.error("deleteNotification error", err);
      rollback();
    }
  };

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.is_read).length,
    [notifications]
  );

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refresh,
        markAsRead,
        toggleRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationsProvider");
  return ctx;
};
