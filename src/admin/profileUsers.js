import React, {  useEffect } from "react";
import { useSelector } from "react-redux";
import {
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  UserCircleIcon,
  IdentificationIcon,
  CalendarIcon,
  MapPinIcon,
  FingerPrintIcon,
} from "@heroicons/react/24/outline";
import { Header } from "../utils/Header";
import Footer from "../utils/Footer";
import { useParams } from "react-router-dom";
// -------------------------------------------- THIS PAGE IS USED FOR ADMIN TO VIEW ANY USER PROFILE ------------------
export default function AdminViewUser() {
  const { id } = useParams(); // Get the user ID from the URL
  const { user } = useSelector((state) => state.auth);
  const [usera, setUsers] = React.useState({}); // State to hold user data

console.log("Admin token:", user?.token); // Log the token for debugging
  console.log("User ID from URL:", id); // Log the user ID for debugging

useEffect(() => {

  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:5090/user/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        }
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
  
      const data = await response.json();
      setUsers(data);
  
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  
  if(user?.token) {
    getData();
  }
  
},[user?.token]);
 

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-myFont2">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-blue-600 h-32" />
            <div className="relative -mt-16 px-6 pb-10 text-center">
              <div className="flex justify-center">
                <UserCircleIcon className="w-32 h-32 text-blue-500 bg-white rounded-full border-4 border-white shadow-md -mt-16" />
              </div>
              <h2 className="text-2xl font-bold mt-4 text-gray-800">
                {usera?.nom} {usera?.prenom}
              </h2>
              <p className="text-gray-500 capitalize">{usera?.role}</p>
            </div>

            <div className="px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">

                <div className="flex items-center space-x-4">
                  <UserIcon className="w-6 h-6 text-blue-500" />
                  <span className="font-medium">Nom:</span>
                  <span>{usera?.nom || "N/A"}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <UserIcon className="w-6 h-6 text-blue-500" />
                  <span className="font-medium">Prénom:</span>
                  <span>{usera?.prenom || "N/A"}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <EnvelopeIcon className="w-6 h-6 text-blue-500" />
                  <span className="font-medium">Email:</span>
                  <span>{usera?.email || "N/A"}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <PhoneIcon className="w-6 h-6 text-blue-500" />
                  <span className="font-medium">Téléphone:</span>
                  <span>{usera?.num_telephone || "N/A"}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <FingerPrintIcon className="w-6 h-6 text-blue-500" />
                  <span className="font-medium">CIN:</span>
                  <span>{usera?.cin || "N/A"}</span>
                </div>

                <div className="flex items-center space-x-4">
                <CalendarIcon className="w-6 h-6 text-blue-500" />
                <span className="font-medium">Date de Naissance:</span>
                <span>{usera?.date_naissance ? usera.date_naissance.slice(0, 10) : "N/A"}</span>
              </div>


                <div className="flex items-center space-x-4">
                  <UserIcon className="w-6 h-6 text-blue-500" />
                  <span className="font-medium">Sexe:</span>
                  <span>{usera?.sexe || "N/A"}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <MapPinIcon className="w-6 h-6 text-blue-500" />
                  <span className="font-medium">Ville:</span>
                  <span>{usera?.ville || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="border-t p-4 flex justify-end">
              <a
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                href="/editProfile"
              >
                Edit Profil
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
