import { useEffect, useState } from "react";
import axios from 'axios';

const Home = () => {
    const [users, setUsers] = useState([]);
    const [activities, setActivities] = useState({}); // Store activities for each user

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/users/getallusers"); 
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const fetchActivities = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/users/activities/${userId}`);
            setActivities((prevActivities) => ({
                ...prevActivities,
                [userId]: response.data, // Store activities for each user by ID
            }));
        } catch (error) {
            console.error("Error fetching activities:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">User List</h1>
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
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b text-gray-700">{user.username}</td>
                                <td className="py-2 px-4 border-b text-gray-700">{user.email}</td>
                                <td className="py-2 px-4 border-b text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b text-gray-600">{new Date(user.lastLogin).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b text-gray-700">
                                    {/* Button to load activities */}
                                    <button 
                                        onClick={() => fetchActivities(user._id)} 
                                        className="text-blue-500 hover:underline"
                                    >
                                        View Activities
                                    </button>
                                    {/* Show activities if loaded */}
                                    {activities[user._id] && (
                                        <ul className="mt-2 text-sm text-gray-600">
                                            {activities[user._id].map((activity, index) => (
                                                <li key={index}>{activity.message}</li>
                                            ))}
                                        </ul>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Home;
