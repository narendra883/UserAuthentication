import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const { email } = useContext(UserContext);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get("https://userauthentication-production-77f9.up.railway.app/api/users/getnotifications", {
                    headers: { 'x-user-email': email }
                });
                setNotifications(response.data);
                setUnreadCount(response.data.filter(notification => !notification.isRead).length);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
        fetchNotifications();
    }, [email]);

    const markAsRead = async (notificationId) => {
        try {
            await axios.patch("https://userauthentication-production-77f9.up.railway.app/api/users/markAsRead", {
                email,
                notificationId
            });
            setNotifications(notifications.map(notification =>
                notification._id === notificationId ? { ...notification, isRead: true } : notification
            ));
            setUnreadCount(unreadCount - 1);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto my-8 p-6 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Notifications</h2>
            {notifications.length >= 0 ? (
                notifications.map(notification => (
                    <div 
                        key={notification._id} 
                        className={`p-4 mb-4 rounded-md shadow-md ${notification.isRead ? 'bg-white' : 'bg-blue-50'}`}
                    >
                        <p className="text-gray-800 text-lg">{notification.message}</p>
                        <p className="text-gray-500 text-sm">{new Date(notification.createdAt).toLocaleString()}</p>
                        {!notification.isRead && (
                            <button 
                                onClick={() => markAsRead(notification._id)} 
                                className="mt-2 px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                            >
                                Mark as read
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-600">No notifications</p>
            )}
        </div>
    );
};

export default Notification;
