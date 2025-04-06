import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Homepage from "./home";
import './index.css';
import Login from "./componenets/login";
import Register from "./componenets/register";
import AdminDashboard from "./admin/dashboard";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import AddTrip from "./driver/createTrajet";
import PassengerDashboard from "./passenger/passengerDashboard";

// Protected Route Component
const ProtectedRoute = ({ element, role }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />; // Redirect if not logged in
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />; // Redirect if role is not authorized
  }

  return element;
};

const App = () => {
  return (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>

      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Protected Routes */}
          <Route 
            path="/admin" 
            element={<ProtectedRoute element={<AdminDashboard />} role="admin" />} 
          />
          <Route 
            path="/admin/editMember" 
            element={<ProtectedRoute element={<AdminDashboard />} role="admin" />} 
          />

          <Route 
            path="/driver/addTrajet" 
            element={<ProtectedRoute element={<AddTrip />} roles={["driver", "admin"]} />} 
          />

          <Route 
            path="/passenger" 
            element={<ProtectedRoute element={<PassengerDashboard />} role="passenger" />} 
          />
           <Route 
            path="/trips" 
             element={<PassengerDashboard />} 
          />
        </Routes>
      </Router>
      </PersistGate>
    </Provider>  
  );
};

export default App;
