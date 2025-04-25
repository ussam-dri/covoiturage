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
import CreateTrip from "./driver/createTrajet";
import DriverDashboard from "./driver/DriverDashboard";
import EditMember from "./admin/editMember";
import ProfilePage from "./utils/profile";
import PassengerDashboard from "./passenger/passengerDashboard";
import AllTrips from "./passenger/allTrips";
import ViewTrip from "./utils/ViewTrip";
import EditTrip from "./utils/EditTrip";
import DriverProfile from "./driver/publicProfile";
import ForgotPassword from "./componenets/ForgotPassword";
import ResetPassword from "./componenets/ResetPassword";
import EditProfiles from "./admin/editProfiles";
import AdminViewUser from "./admin/profileUsers";
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

          {/* --------------------------------  Admin Protected Routes  -------------------------------------------- */}
          <Route 
            path="/admin" 
            element={<ProtectedRoute element={<AdminDashboard />} role="admin" />} 
          />
         
          <Route 
            path="/admin/editMember/:id" 
            element={<ProtectedRoute element={<EditProfiles />} role="admin" />} 
          />
           <Route 
            path="/admin/viewMember/:id" 
            element={<ProtectedRoute element={<AdminViewUser />} role="admin" />} 
          />
           {/* ---------------- Driver Protected Routes ----------------------------------------*/}
          <Route 
            path="/driver/addTrajet" 
            element={<ProtectedRoute element={<CreateTrip />} roles={["driver", "admin"]} />} 
          />
          <Route 
            path="/driver/dashboard" 
            element={<ProtectedRoute element={<DriverDashboard />} roles="driver" />} 
          />
          
          {/* <Route 
            path="/driver/editMember" 
            element={<ProtectedRoute element={<EditMember />} role="driver" />} 
          /> */}
            <Route 
            path="/driver/trip/view/:id" 
            element={<ProtectedRoute element={<ViewTrip />} roles={["driver", "admin"]} />} 
          />
           <Route 
            path="/driver/trip/edit/:id" 
            element={<ProtectedRoute element={<EditTrip />} roles={["driver", "admin"]} />} 
          />
           {/* -------------------------------------- Passenger Protected Routes -------------------------------------*/}
          <Route 
            path="/passenger" 
            element={<ProtectedRoute element={<PassengerDashboard />} role="passenger" />} 
          />
            <Route 
            path="/passenger/trip/view/:id" 
            element={<ProtectedRoute element={<ViewTrip />} roles="driver" />} 
          />
          {/* -------------- Profile page for all users---------------------- */}
           <Route 
            path="/profile" 
            element={<ProfilePage />} 
          />
          <Route 
            path="/editProfile" 
            element={<EditMember />} 
          />
           {/* ------------------- Visitors   Routes ----------------------------------*/}
           <Route 
            path="/trips" 
             element={<AllTrips />} 
          />
          {/* -------------- reseet Password ------------------ */}
              <Route 
            path="/forgot-password" 
             element={<ForgotPassword />} 
          />
            <Route 
            path="/reset-password/:token" 
             element={<ResetPassword />} 
          />
          
          <Route path="/driverProfile/:id" element={<DriverProfile />} />

        </Routes>
      </Router>
      </PersistGate>
    </Provider>  
  );
};

export default App;
