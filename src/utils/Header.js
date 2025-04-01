import React from "react";
import { useSelector } from "react-redux";

export const Header = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div>
      <nav className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-4">
          <img src="/images/logo.png" alt="ChutChutCar Logo" className="h-10" />
          <div className="space-x-4 font-myFont">
            <a href="#" className="text-blue-600">Covoiturage</a>
            <a href="#" className="text-gray-600">Bus</a>
            <a href="#" className="text-gray-600">BlaBlaDaily</a>
          </div>
        </div>

        <div className="flex items-center space-x-4 font-myFont">
          <button className="text-blue-600">Rechercher</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Publier un trajet
          </button>

          <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
            {isAuthenticated ? (
              <span className="text-blue-600 font-semibold">
                {user.email} | {user.role}
              </span>
            ) : (
              <ul className="space-x-2">
                <li>
                  <a href="/login" className="text-blue-600">
                    Login
                  </a>
                </li>
                <li>
                  <a href="/register" className="text-blue-600">
                    Register
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};
