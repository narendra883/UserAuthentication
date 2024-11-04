import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Register from './Pages/Register';
import Home from './Pages/Home';
import Profile from './components/Profile';
import Navbar from "./components/Navbar";
import Notification from "./components/Notification";

import Logout from "./Pages/Logout";
function App() {

    return (
        <Router>
            <Navbar/>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/notification" element={<Notification />}/> 
                    <Route path="/logout" element={<Logout />}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
