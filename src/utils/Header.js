import React, { useState } from "react";
import { useSelector } from "react-redux";
import useLogout from "./logout";
import { useNavigate } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import {
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export const Header = ({ variant = "default" }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const logout = useLogout();
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (!user || !user.role) return null;
    switch (user.role) {
      case "admin":
        return { label: "Admin Dashboard", href: "/admin" };
      case "driver":
        return { label: "Driver Dashboard", href: "/driver/dashboard" };
      case "passenger":
        return { label: "Passenger Dashboard", href: "/passenger" };
      default:
        return null;
    }
  };

  const dashboardLink = getDashboardLink();

  return (
    <nav className="flex justify-between items-center p-4 border-b bg-white font-myFont">
      <div className="flex items-center space-x-4">
        <img src="/images/logo.png" alt="ChutChutCar Logo" className="h-10" />
        <a href="/" className="text-blue-600 text-lg font-semibold">
          CoDrive
        </a>
      </div>

      <div className="flex items-center space-x-4 font-myFont2">
        <a href="/trips" className="text-blue-600 hover:underline">
          See All Trips
        </a>

        {variant !== "passenger" && (
          <a
            href="/driver/addTrajet"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Post a ride
          </a>
        )}

        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-blue-600 shadow ring-1 ring-blue-300 hover:bg-blue-50 focus:outline-none">
              <UserCircleIcon className="w-6 h-6" />
              <ChevronDownIcon className="w-5 h-5 text-blue-600" />
            </MenuButton>
          </div>

          <MenuItems className="absolute right-0 z-10 mt-2 w-60 origin-top-right rounded-lg bg-white text-gray-800 shadow-lg ring-1 ring-black/10 focus:outline-none">
            <div className="py-1">
              {isAuthenticated ? (
                <>
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="/profile"
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex items-center w-full text-left px-4 py-2 text-sm text-blue-600 font-semibold gap-2`}
                      >
                        <UserCircleIcon className="w-5 h-5" />
                        {user.nom} {user.prenom}
                        </a>
                    )}
                  </MenuItem>

                  {dashboardLink && (
                    <MenuItem>
                      {({ active }) => (
                        <a
                          href={dashboardLink.href}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } flex items-center px-4 py-2 text-sm text-blue-600 gap-2`}
                        >
                          <ClipboardDocumentListIcon className="w-5 h-5" />
                          {dashboardLink.label}
                        </a>
                      )}
                    </MenuItem>
                  )}

                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex items-center w-full text-left px-4 py-2 text-sm text-red-600 gap-2`}
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        Logout
                      </button>
                    )}
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="/login"
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex items-center px-4 py-2 text-sm gap-2`}
                      >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                        Login
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="/register"
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex items-center px-4 py-2 text-sm gap-2`}
                      >
                        <Cog6ToothIcon className="w-5 h-5" />
                        Register
                      </a>
                    )}
                  </MenuItem>
                </>
              )}
            </div>
          </MenuItems>
        </Menu>
      </div>
    </nav>
  );
};
