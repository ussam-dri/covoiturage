import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Header } from './Header';
import Footer from './Footer';

function EditTrip() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:5090/view-trip/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = await res.json();
        setTrip(data);
      } catch (error) {
        console.error("Failed to fetch trip:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrip();
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTrip({ ...trip, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await fetch(`http://localhost:5090/edit-trip/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trip),
      });
      navigate('/driver/dashboard');
    } catch (error) {
      console.error("Failed to update trip:", error);
      setIsLoading(false);
    }
  };

  if (isLoading && !trip) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading trip details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 p-6">
              <h2 className="text-2xl font-bold text-white">Edit Trip</h2>
              <p className="text-blue-100 mt-1">Update your trip details below</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure City</label>
                  <input 
                    name="ville_depart" 
                    value={trip?.ville_depart || ''} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Departure city"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arrival City</label>
                  <input 
                    name="ville_arriver" 
                    value={trip?.ville_arriver || ''} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Arrival city"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                  <input 
                    name="date_depart" 
                    type="date" 
                    value={trip?.date_depart || ''} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                  <input 
                    name="heure_depart" 
                    type="time" 
                    value={trip?.heure_depart || ''} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input 
                      name="prix" 
                      type="number" 
                      value={trip?.prix || ''} 
                      onChange={handleChange} 
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats</label>
                  <input 
                    name="nbr_places" 
                    type="number" 
                    value={trip?.nbr_places || ''} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trip Status</label>
                <select
                    name="status"
                    value={trip?.status?.toString() || '0'}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="0">Future</option>
                    <option value="1">Current</option>
                    <option value="2">Completed</option>
                </select>
                </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Trip Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="fumer" 
                      checked={trip?.fumer || false} 
                      onChange={handleChange} 
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Smoking Allowed</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="animaux" 
                      checked={trip?.animaux || false} 
                      onChange={handleChange} 
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Pets Allowed</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="musique" 
                      checked={trip?.musique || false} 
                      onChange={handleChange} 
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Music Allowed</span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => navigate('/driver/dashboard')} 
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EditTrip;