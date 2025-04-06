import React, { useState } from 'react';
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  Users,
  Music,
  CookingPot as Smoking,
  Dog,
  BanknoteIcon
} from 'lucide-react';
import Footer from '../utils/Footer';
import { Header } from '../utils/Header';

const CreateTrip = () => {
  const [formData, setFormData] = useState({
    date_depart: "",
    date_arrivee: "",
    heure_depart: "",
    heure_arrivee: "",
    ville_depart: "",
    ville_arriver: "",
    prix: "",
    nbr_places: "",
    fumer: "0",
    animaux: "0",
    musique: "0",
    marque: "",
    matricule: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Trip created successfully!');
        setFormData({
          date_depart: "",
          date_arrivee: "",
          heure_depart: "",
          heure_arrivee: "",
          ville_depart: "",
          ville_arriver: "",
          prix: "",
          nbr_places: "",
          fumer: "0",
          animaux: "0",
          musique: "0",
          marque: "",
          matricule: ""
        });
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  return (
    <>
    {/* <nav className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-4">
          <img src="/images/logo.png" alt="ChutChutCar Logo" className="h-10" />
          <div className="space-x-4 font-myFont">
            <a href="/" className="text-blue-600">coDrive</a>
         
          </div>
        </div>
      </nav> */}
<Header></Header>
<div className="mt-10 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Offer a Ride</h1>
        <p className="text-blue-100">Share your journey and help others travel sustainably</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-b-xl shadow-lg p-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Departure Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Departure Details
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
              <input
                type="date"
                name="date_depart"
                value={formData.date_depart}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
              <input
                type="time"
                name="heure_depart"
                value={formData.heure_depart}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure City</label>
              <input
                type="text"
                name="ville_depart"
                value={formData.ville_depart}
                onChange={handleChange}
                placeholder="Enter departure city"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Arrival Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Arrival Details
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Date</label>
              <input
                type="date"
                name="date_arrivee"
                value={formData.date_arrivee}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
              <input
                type="time"
                name="heure_arrivee"
                value={formData.heure_arrivee}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arrival City</label>
              <input
                type="text"
                name="ville_arriver"
                value={formData.ville_arriver}
                onChange={handleChange}
                placeholder="Enter arrival city"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-600" />
            Trip Details
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per Seat (€)</label>
              <div className="relative">
                <BanknoteIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="nbr_places"
                  value={formData.nbr_places}
                  onChange={handleChange}
                  min="1"
                  max="8"
                  className="w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Smoking Allowed</label>
              <select
                name="fumer"
                value={formData.fumer}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pets Allowed</label>
              <select
                name="animaux"
                value={formData.animaux}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Music Preferences</label>
              <select
                name="musique"
                value={formData.musique}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="0">No music</option>
                <option value="1">Light music</option>
                <option value="2">Driver's choice</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Brand</label>
              <input
                type="text"
                name="marque"
                value={formData.marque}
                onChange={handleChange}
                placeholder="e.g., Toyota, BMW"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
              <input
                type="text"
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                placeholder="Enter license plate number"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Car className="h-5 w-5" />
            Create Trip
          </button>
        </div>
      </form>
    </div>
    <Footer></Footer>
    </>
  );
};

export default CreateTrip;
