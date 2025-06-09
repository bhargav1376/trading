import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './Signin/Signin';
import Signup from './Signup/Signup';
import Home from './index/Home';
import Homepage from './Weblogin/Home/Homepage';
// import Homepage1 from './Home/Homepage copy';
//import Homepage2 from './Home/Homepage copy 2';
import Forgotpassword from './Forgotpassword/Forgotpassword';
import Otp from './Otp/Otp';
import Updatepassword from './Updatepassword/Updatepassword';
import Signupotp from './Signupotp/Signupotp';
import Admin from './Admin/Admin';
import './App.css';
import Profile from './Weblogin/Profile/Profile';

function App() {
    return (
        <Router basename="/trading">
            <div className="App">
                <Routes>
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/homepage" element={<Homepage />} />
                    <Route path="/profile" element={<Profile />} />
                    {/* <Route path="/homepage1" element={<Homepage1 />} /> */}
                    {/* <Route path="/homepage2" element={<Homepage2 />} /> */}
                    <Route path="/forgot-password" element={<Forgotpassword />} />
                    <Route path="/otp" element={<Otp />} />
                    <Route path="/update-password" element={<Updatepassword />} />
                    <Route path="/signup-otp" element={<Signupotp />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
