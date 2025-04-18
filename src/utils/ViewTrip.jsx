import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import Footer from './Footer';
import { useSelector } from "react-redux";
import {User,ShieldCheck} from 'lucide-react';
function ViewTrip() {
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [driver, setDriver] = useState(null);
  const navigate = useNavigate();

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
  
  useEffect(() => {
    const fetchDriver = async () => {
      if (!trip?.id_driver) return;
      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:5090/user/${trip.id_driver}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = await res.json();
        setDriver(data);
      } catch (error) {
        console.error("Failed to fetch driver:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchDriver();
  }, [trip, user]);
  
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
              <h2 className="text-2xl font-bold text-white">Trip Details</h2>
              <p className="text-blue-100 mt-1">View information about this trip</p>
            </div>
            <div className="bg-white shadow  overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-blue-200 to-purple-300 p-6 text-black">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-white text-blue-500 rounded-full p-3 mr-4">
                      <User size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">{driver?.prenom} {driver?.nom}</h2>
                      <p className="text-blue-900 flex items-center gap-1">
                        <ShieldCheck size={16} />
                        Verified Driver
                      </p>
                    </div>
                  </div>
               
                </div>
              </div>
                  
                  
</div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-b pb-4 md:border-b-0 md:pb-0 md:border-r md:pr-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Route Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">From</p>
                        <p className="text-lg font-medium text-gray-900">{trip.ville_depart}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">To</p>
                        <p className="text-lg font-medium text-gray-900">{trip.ville_arriver}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="text-lg font-medium text-gray-900">{new Date(trip.date_depart).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="text-lg font-medium text-gray-900">{trip.heure_depart}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Trip Details</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="text-lg font-medium text-gray-900">{trip.prix} €</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-500">Available Seats</p>
                          <p className="text-lg font-medium text-gray-900">{trip.nbr_places}</p>
                        </div>
                        
                      </div>
                      <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Trip Status</h3>
                        <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            trip.status === 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : trip.status === 1
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                            {trip.status === 0
                                ? 'Upcoming'
                                : trip.status === 1
                                ? 'Ongoing'
                                : 'Completed'}
                            </span>
                        </div>
                        </div>

                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Trip Preferences</h3>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className={`flex items-center rounded-md p-3 ${trip.fumer ? 'bg-blue-50' : 'bg-gray-50'}`}>
                        <div className={`h-4 w-4 rounded-full ${trip.fumer ? 'bg-blue-500' : 'bg-gray-300'} mr-3`}></div>
                        <span className="text-gray-700">Smoking: {trip.fumer ? 'Allowed' : 'Not allowed'}</span>
                      </div>
                      
                      <div className={`flex items-center rounded-md p-3 ${trip.animaux ? 'bg-blue-50' : 'bg-gray-50'}`}>
                        <div className={`h-4 w-4 rounded-full ${trip.animaux ? 'bg-blue-500' : 'bg-gray-300'} mr-3`}></div>
                        <span className="text-gray-700">Pets: {trip.animaux ? 'Allowed' : 'Not allowed'}</span>
                      </div>
                      
                      <div className={`flex items-center rounded-md p-3 ${trip.musique ? 'bg-blue-50' : 'bg-gray-50'}`}>
                        <div className={`h-4 w-4 rounded-full ${trip.musique ? 'bg-blue-500' : 'bg-gray-300'} mr-3`}></div>
                        <span className="text-gray-700">Music: {trip.musique ? 'Allowed' : 'Not allowed'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button 
                  onClick={() => navigate(-1)} 
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ViewTrip;