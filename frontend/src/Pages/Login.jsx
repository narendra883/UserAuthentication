import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUsername } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://userauthentication-production-77f9.up.railway.app/api/users/login", { email, password });
      localStorage.setItem("email", email);
      localStorage.setItem("username",response.data.username);
      setUsername(response.data.username);
      navigate("/");
    } catch (err) {
      console.error('Login failed', err);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
