import React from "react";
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

export default function AdminProfilePage() {
  const { user } = useSelector((state) => state.auth);

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
                {user?.nom} {user?.prenom}
              </h2>
              <p className="text-gray-500 capitalize">{user?.role}</p>
            </div>

            <div className="px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">

                <div className="flex items-center space-x-4">
                  <UserIcon className="w-6 h-6 text-blue-500" />
                  <span className="font-medium">Nom:</span>
                  <span>{user?.nom || "N/A"}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <UserIcon className="w-6 h-6 text-blue-500" />
                  <span className="font-medium">Prénom:</span>
                  <span>{user?.prenom || "N/A"}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <EnvelopeIcon className="w-6 h-6 text-blue-500" />
                  <span className="font-medium">Email:</span>
                  <span>{user?.email || "N/A"}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <PhoneIcon className="w-6 h-6 text-blue-500" />
                  <span className="font-medium">Téléphone:</span>
                  <span>{user?.num_telephone || "N/A"}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <FingerPrintIcon className="w-6 h-6 text-blue-500" />
                  <span className="font-medium">CIN:</span>
                  <span>{user?.cin || "N/A"}</span>
                </div>

                <div className="flex items-center space-x-4">
                <CalendarIcon className="w-6 h-6 text-blue-500" />
                <span className="font-medium">Date de Naissance:</span>
                <span>{user?.date_naissance ? user.date_naissance.slice(0, 10) : "N/A"}</span>
              </div>


                <div className="flex items-center space-x-4">
                  <UserIcon className="w-6 h-6 text-blue-500" />
                  <span className="font-medium">Sexe:</span>
                  <span>{user?.sexe || "N/A"}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <MapPinIcon className="w-6 h-6 text-blue-500" />
                  <span className="font-medium">Ville:</span>
                  <span>{user?.ville || "N/A"}</span>
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
