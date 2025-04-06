import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useLogout from "./logout";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export const Header = ({ variant = "default" }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const logout = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("#user-menu")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const getDashboardLink = () => {
    if (!user || !user.role) return null;
    switch (user.role) {
      case "admin":
        return { label: "Admin Dashboard", href: "/admin" };
      case "driver":
        return { label: "Driver Dashboard", href: "/driver/dashboard" };
      case "passenger":
        return { label: "Passenger Dashboard", href: "/passenger/dashboard" };
      default:
        return null;
    }
  };

  const dashboardLink = getDashboardLink();

  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center space-x-4">
        <img src="/images/logo.png" alt="ChutChutCar Logo" className="h-10" />
        <div className="space-x-4 font-myFont">
          <a href="/" className="text-blue-600">CoDrive</a>
        </div>
      </div>

      <div className="flex items-center space-x-4 font-myFont2">
        <button className="text-blue-600">
          <a href="/trips">See All Trips</a>
        </button>

        {variant !== "passenger" && (
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            <a href="/driver/addTrajet">Post a ride</a>
          </button>
        )}

        {/* User Dropdown */}
        <div id="user-menu" className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-blue-600 focus:outline-none"
          >
            <UserCircleIcon className="w-8 h-8" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg p-2 z-50">
              {isAuthenticated ? (
                <div>
                  <p className="text-gray-700 font-semibold px-2">
                    {user.nom} {user.prenom}
                  </p>

                  {dashboardLink && (
                    <a
                      href={dashboardLink.href}
                      className="block w-full text-left py-2 px-2 text-blue-600 hover:bg-gray-100 rounded"
                    >
                      {dashboardLink.label}
                    </a>
                  )}

                  <button
                    onClick={logout}
                    className="text-red-500 w-full text-left py-2 px-2 hover:bg-gray-100 rounded"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div>
                  <a href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Login</a>
                  <a href="/register" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Register</a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
