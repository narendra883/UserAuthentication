import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import picture from "../picture2.jpg";

import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import { FaSun, FaMoon } from 'react-icons/fa';

const Navbar = () => {
    const [profilePic, setProfilePic] = useState('');
    const {username} = useContext(UserContext);
    const email = localStorage.getItem("email")
    const {darkMode, toggleTheme} = useContext(ThemeContext);
    
    useEffect(() => {
        axios.get("https://userauthentication-production-77f9.up.railway.app/api/users/userprofile", {
            headers: {
                'x-user-email': email 
            }
        })
        .then(response => setProfilePic(response.data.profilePic))
        .catch(error => console.error("Failed to fetch profile picture", error));
    }, []);

    return (
        <nav className="navbar flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg">
            <div className="flex space-x-4">
                <Link to="/" className="text-white font-semibold hover:text-purple-200 transition-colors">Home</Link>
                {!localStorage.getItem("email")?(
                  <div>
                    <Link to="/login" className="text-white font-semibold hover:text-purple-200 transition-colors">Login</Link>
                    <Link to="/register" className="text-white ml-4 font-semibold hover:text-purple-200 transition-colors">Register</Link>
                    
                  </div>
                  ):(
                    <Link to="/logout" className="text-white font-semibold hover:text-purple-200 transition-colors">Logout</Link> 
                  )
                }
            </div>
            <button onClick={toggleTheme} className="text-white text-2xl focus:outline-none">
                {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            {!!localStorage.getItem("email") &&
            <div className="flex mt-4">
            <p className="text-white mr-4">welcome {username}</p>
            <Link to="/profile" className="flex items-center">
                <img 
                    src={profilePic || picture} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-105 transition-transform"
                />
            </Link>
            </div>
            }
        </nav>
    );
};

export default Navbar;
