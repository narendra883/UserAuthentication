import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { UserContext, UserProvider } from "../context/UserContext";

const Home = () => {
    const [user, setUser] = useState(null); 
    const [activities, setActivities] = useState([]);
    const { username } = useContext(UserContext); 
    const {email} = useContext(UserContext);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                
                const response = await axios.get(`http://localhost:5000/api/users/getuser`,{
                    headers: {
                        'x-user-email': email 
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (username) {
            fetchUser();
        }
    }, [username]);

    const fetchActivities = async () => {
        try {
            const response = await axios.get(`https://userauthentication-production-77f9.up.railway.app/api/users/activities/${user._id}`);
            setActivities(response.data);
        } catch (error) {
            console.error("Error fetching activities:", error);
        }
    };

    if (!user) {
        return <div>Please login first</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome {username}</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="py-2 px-4 border-b font-semibold text-left">Username</th>
                            <th className="py-2 px-4 border-b font-semibold text-left">Email</th>
                            <th className="py-2 px-4 border-b font-semibold text-left">Joined Date</th>
                            <th className="py-2 px-4 border-b font-semibold text-left">Last Login</th>
                            <th className="py-2 px-4 border-b font-semibold text-left">Activities</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b text-gray-700">{user.username}</td>
                            <td className="py-2 px-4 border-b text-gray-700">{user.email}</td>
                            <td className="py-2 px-4 border-b text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b text-gray-600">{new Date(user.lastLogin).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b text-gray-700">
                                <button 
                                    onClick={fetchActivities} 
                                    className="text-blue-500 hover:underline"
                                >
                                    View Activities
                                </button>
                                
                                {activities.length > 0 && (
                                    <ul className="mt-2 text-sm text-gray-600">
                                        {activities.map((activity, index) => (
                                            <li key={index}>{activity.message}</li>
                                        ))}
                                    </ul>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Home;
