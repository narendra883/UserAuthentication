import { useState, useEffect } from 'react';
import axios from 'axios';
import picture from "../picture2.jpg";

const Profile = () => {
    const email = localStorage.getItem("email");
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        profilePic: ''
    });
    const [newProfilePic, setNewProfilePic] = useState('');

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get("https://userauthentication-production-77f9.up.railway.app/api/users/userprofile", {
                headers: {
                    'x-user-email': email 
                }
            });
            
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleProfilePicChange = (e) => setNewProfilePic(e.target.value);

    const handleProfileUpdate = async () => {
        try {
            await axios.put("http://localhost:5000/api/users/updateProfile", 
                { profilePic: newProfilePic },
                {
                    headers: {
                        'x-user-email': email 
                    }
                }
            );
            setUserData(prevData => ({ ...prevData, profilePic: newProfilePic }));
            setNewProfilePic('');
            alert("Profile picture updated successfully!");
        } catch (error) {
            console.error("Error updating profile picture:", error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">User Profile</h2>
            <p className="text-gray-600 mb-2"><strong>Username:</strong> {userData.username}</p>
            <p className="text-gray-600 mb-4"><strong>Email:</strong> {userData.email}</p>
            <div className="flex justify-center mb-4">
                <img 
                    src={userData.profilePic || picture} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full border border-gray-300 shadow-sm"
                />
            </div>
            <input
                type="text"
                placeholder="Enter profile picture URL"
                value={newProfilePic}
                onChange={handleProfilePicChange}
                className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
                onClick={handleProfileUpdate} 
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors font-semibold"
            >
                Upload Picture
            </button>
        </div>
    );
};

export default Profile;
