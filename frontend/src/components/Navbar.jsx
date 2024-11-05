import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaBell, FaSun, FaMoon } from "react-icons/fa";
import picture from "../picture2.jpg";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = () => {
    const [profilePic, setProfilePic] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const { username } = useContext(UserContext);
    const email = localStorage.getItem("email");
    const { darkMode, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get("https://userauthentication-production-77f9.up.railway.app/api/users/userprofile", {
                    headers: { 'x-user-email': email }
                });
                setProfilePic(response.data.profilePic);
                const notifications = response.data.user.notifications.filter(notif => !notif.isRead).length;
                setUnreadCount(notifications);
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            }
        };

        fetchProfileData();
    }, [email]);

    return (
        <nav className="navbar flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg">
            <div className="flex space-x-4">
                <Link to="/" className="text-white font-semibold hover:text-purple-200 transition-colors">Home</Link>
                {!localStorage.getItem("email") ? (
                    <div>
                        <Link to="/login" className="text-white font-semibold hover:text-purple-200 transition-colors">Login</Link>
                        <Link to="/register" className="text-white ml-4 font-semibold hover:text-purple-200 transition-colors">Register</Link>
                    </div>
                ) : (
                    <div className="flex relative items-center">
                        <Link to="/notification" className="text-white font-semibold hover:text-purple-200 transition-colors relative">
                            <FaBell className="text-2xl" />
                            {unreadCount>-1  && (
                                <span className="absolute top-0 -right-2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/logout" className="text-white font-semibold hover:text-purple-200 transition-colors ml-4">Logout</Link>
                    </div>
                )}
            </div>
            <button onClick={toggleTheme} className="text-white text-2xl focus:outline-none">
                {darkMode ? <FaMoon />: <FaSun />}
            </button>
            {!!localStorage.getItem("email") && (
                <div className="flex items-center">
                    <p className="text-white mr-4">Welcome {username}</p>
                    <Link to="/profile">
                        <img 
                            src={profilePic || picture} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-105 transition-transform"
                        />
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
