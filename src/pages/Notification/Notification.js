import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaBellSlash, FaCheckCircle, FaTrash, FaTimes } from "react-icons/fa";
import "./Notification.css";
import { NotificationContext } from "../../context/NotificationContext";

const Notification = () => {
  const {
    notifications,
    fetchNotifications,
    markNotificationAsRead,
    deleteNotifications,
  } = useContext(NotificationContext);

  const navigate = useNavigate();
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationClick = (notification) => {
    if (selectionMode) {
      toggleSelection(notification._id);
      return;
    }
    markNotificationAsRead(notification._id);
    if (notification.url) {
      navigate(notification.url);
    }
  };

  const handleLongPress = (notificationId) => {
    setSelectionMode(true);
    toggleSelection(notificationId);
  };

  const toggleSelection = (notificationId) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId) ? prev.filter((id) => id !== notificationId) : [...prev, notificationId]
    );
  };

  const clearSelection = () => {
    setSelectedNotifications([]);
    setSelectionMode(false);
  };

  const handleBulkMarkAsRead = () => {
    selectedNotifications.forEach((id) => markNotificationAsRead(id));
    clearSelection();
  };

  const handleBulkDelete = () => {
    deleteNotifications(selectedNotifications);
    clearSelection();
  };

  return (
    <div className="notification-container">
      <div className="header">
        {selectionMode ? (
          <>
            <button onClick={clearSelection}><FaTimes /></button>
            <span>{selectedNotifications.length} Selected</span>
            <button onClick={handleBulkMarkAsRead}><FaCheckCircle className="green" /></button>
            <button onClick={handleBulkDelete}><FaTrash className="red" /></button>
          </>
        ) : (
          <>
            <button onClick={() => navigate(-1)}><FaBell /></button>
            <span>Notifications</span>
          </>
        )}
      </div>
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <FaBellSlash size={40} />
            <p>No notifications available</p>
          </div>
        ) : (
          notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item) => (
            <div
              key={item._id}
              className={`notification-card ${item.read ? "read" : ""}`}
              onClick={() => handleNotificationClick(item)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleLongPress(item._id);
              }}
            >
              {selectionMode && (
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(item._id)}
                  onChange={() => toggleSelection(item._id)}
                />
              )}
              <div className="notification-content">
                <h4>{item.title}</h4>
                <p>{item.message}</p>
              </div>
              {!item.read && !selectionMode && <div className="unread-indicator" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
