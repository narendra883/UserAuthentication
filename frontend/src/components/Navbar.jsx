import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import picture from "../picture2.jpg";
import AuthService from "../service/AuthService";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
    const [profilePic, setProfilePic] = useState('');
    const {username} = useContext(UserContext);
    const email = localStorage.getItem("email")
    
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
                {!AuthService.isAuthenticated()?(
                  <div>
                    <Link to="/login" className="text-white font-semibold hover:text-purple-200 transition-colors">Login</Link>
                    <Link to="/register" className="text-white ml-4 font-semibold hover:text-purple-200 transition-colors">Register</Link>
                    
                  </div>
                  ):(
                    <Link to="/logout" className="text-white font-semibold hover:text-purple-200 transition-colors">Logout</Link> 
                  )
                }
            </div>
            {!!AuthService.isAuthenticated() &&
            <Link to="/profile" className="flex items-center">
              <p>welcome {username || "Guest"}</p>
                <img 
                    src={profilePic || picture} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-105 transition-transform"
                />
            </Link>
            }
        </nav>
    );
};

export default Navbar;
