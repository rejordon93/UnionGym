// App.tsx
import React from "react";
import "semantic-ui-css/semantic.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { LandingPage } from "./components/LandingPage";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { Logout } from "./components/Logout";
import { Workouts } from "./components/Workouts";
import NotFoundPage from "./components/NotFoundPage"; // Import NotFoundPage

import "./App.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<NotFoundPage />} />{" "}
      </Routes>
    </Router>
  );
};

export default App;
