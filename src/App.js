import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./home";
import './index.css';
import Login from "./componenets/login";
import Register from "./componenets/register";
import { Provider } from 'react-redux';
import store from './redux/store';
import AdminDashboard from "./admin/dashboard";

const App = () => {
  return (
    <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </Router>
  </Provider>  
);
};

export default App;
