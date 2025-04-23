import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Predict from "./components/Predict";
import Predict2 from "./components/Predict2";
import Profile from "./components/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute"; // ✅ Import PublicRoute
import "./styles.css";

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<PublicRoute><Signup /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/home" element={<Home />} />
                <Route path="/predict" element={<PrivateRoute><Predict /></PrivateRoute>} />
                <Route path="/predict2" element={<PrivateRoute><Predict2 /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
