import React, { useState, useEffect } from 'react';
import { Header } from '../utils/Header';
import {
  Users, Settings, MapPin, Calendar, DollarSign, Star, Car, Eye, Pencil, Trash2, ChevronRight, ClipboardList
} from 'lucide-react';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import Requests from '../driver/requests'; // Import the new Requests component

function DriverDashboard() {
  const [activeSection, setActiveSection] = useState('trips');
  const [tripView, setTripView] = useState('all'); // 'all', 'future', 'completed'
  const [trips, setTrips] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [passengerMap, setPassengerMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5090/driver-trips/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRatingsAndUsers = async () => {
      try {
        const response = await fetch(`http://localhost:5090/driver/reviews/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const ratingData = await response.json();
        setRatings(ratingData);

        // Extract unique passenger IDs
        const passengerIds = [...new Set(ratingData.map(r => r.id_passenger))];
        const map = {};

        await Promise.all(passengerIds.map(async (id) => {
          try {
            const res = await fetch(`http://localhost:5090/user/${id}`, {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            });
            const data = await res.json();
            map[id] = data;
          } catch (err) {
            console.error(`Error fetching user ${id}:`, err);
          }
        }));

        setPassengerMap(map);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    if (user?.id && user?.token) {
      fetchTrips();
      fetchRatingsAndUsers();
    }
  }, [user?.id, user?.token]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this trip?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5090/delete-trip/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.ok) {
        setTrips(trips.filter((trip) => trip.id_trajet !== id));
      } else {
        console.error('Failed to delete trip');
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const filteredTrips = trips.filter((trip) => {
    if (tripView === 'future') return trip.status === 0;
    if (tripView === 'completed') return trip.status === 2;
    return true;
  });

  const getTripStatusBadge = (status) => {
    if (status === 0) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Upcoming</span>;
    if (status === 2) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Completed</span>;
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">In Progress</span>;
  };

  const getAmenityIcon = (isEnabled) => {
    return isEnabled ? 
      <span className="text-green-500">Yes</span> : 
      <span className="text-red-400">No</span>;
  };

  const renderTrips = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (filteredTrips.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Car size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">No {tripView} trips found</h3>
          <p className="text-gray-500 mt-2">Your {tripView} trips will appear here once scheduled.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredTrips.map((trip) => (
          <div
            key={trip.id_trajet}
            className="border rounded-lg p-5 hover:shadow transition-shadow bg-white"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-full">
                  <MapPin className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {trip.ville_depart} <ChevronRight size={16} className="inline text-gray-400" /> {trip.ville_arriver}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(trip.date_depart).toLocaleDateString()}</span>
                    </div>
                    <div>{trip.heure_depart.slice(0, 5)}</div>
                    {getTripStatusBadge(trip.status)}
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold text-green-600">{trip.prix} €</div>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-1">
                <Users size={16} className="text-gray-500" />
                <span>{trip.nbr_places} seats available</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-medium">Smoking:</span> {getAmenityIcon(trip.fumer)}
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-medium">Pets:</span> {getAmenityIcon(trip.animaux)}
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-medium">Music:</span> {getAmenityIcon(trip.musique)}
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => navigate(`/driver/trip/view/${trip.id_trajet}`)}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                title="View Trip"
              >
                <Eye size={16} />
                <span>View</span>
              </button>

              <button
                onClick={() => navigate(`/driver/trip/edit/${trip.id_trajet}`)}
                className="flex items-center space-x-1 px-3 py-2 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 transition-colors"
                title="Edit Trip"
              >
                <Pencil size={16} />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleDelete(trip.id_trajet)}
                className="flex items-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                title="Delete Trip"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRatings = () => {
    if (ratings.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Star size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">No ratings yet</h3>
          <p className="text-gray-500 mt-2">Your passenger ratings will appear here once received.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {ratings.map((rating) => {
          const passenger = passengerMap[rating.id_passenger];
          return (
            <div
              key={rating.id}
              className="border rounded-lg p-5 hover:shadow transition-shadow bg-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 rounded-full p-2">
                    <Users size={20} className="text-gray-600" />
                  </div>
                  <div className="font-medium text-lg">
                    {passenger ? `${passenger.nom} ${passenger.prenom}` : 'Anonymous Passenger'}
                  </div>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={18}
                      className={index < rating.rating ? 'text-yellow-500' : 'text-gray-300'}
                      fill={index < rating.rating ? '#facc15' : 'none'}
                    />
                  ))}
                  <span className="ml-2 font-medium">{rating.rating}/5</span>
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-gray-50 rounded-md italic text-gray-700">
                {rating.message || <span className="text-gray-400">No message provided</span>}
              </div>
              
              <div className="mt-2 text-xs text-gray-500 text-right">
                {rating.date ? new Date(rating.date).toLocaleDateString() : 'Date not available'}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMainContent = () => {
    if (activeSection === 'trips') {
      return (
        <div className="space-y-6">
          <div className="flex space-x-2">
            {['all', 'future', 'completed'].map(view => (
              <button
                key={view}
                onClick={() => setTripView(view)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  tripView === view 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)} Trips
              </button>
            ))}
          </div>
          
          {renderTrips()}
        </div>
      );
    }

    if (activeSection === 'ratings') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Your Ratings</h2>
            {ratings.length > 0 && (
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                <Star size={16} className="text-yellow-500 mr-1" fill="#facc15" />
                <span className="font-medium">
                  {(ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)} 
                  <span className="text-gray-500 font-normal">/ 5</span>
                </span>
              </div>
            )}
          </div>
          
          {renderRatings()}
        </div>
      );
    }

    if (activeSection === 'requests') {
      return <Requests />;
    }

    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <Settings size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-700">
          {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} section
        </h3>
        <p className="text-gray-500 mt-2">This feature is coming soon...</p>
      </div>
    );
  };

  return (
    <>
      <Header variant="driver" />
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm p-6 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Driver Hub</h2>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveSection('trips')} 
                className={`flex items-center space-x-3 px-4 py-3 w-full rounded-lg transition-colors ${
                  activeSection === 'trips' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Car size={20} />
                <span className="font-medium">My Trips</span>
              </button>
              <button 
                onClick={() => setActiveSection('requests')} 
                className={`flex items-center space-x-3 px-4 py-3 w-full rounded-lg transition-colors ${
                  activeSection === 'requests' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ClipboardList size={20} />
                <span className="font-medium">Requests</span>
              </button>
              <button 
                onClick={() => setActiveSection('payments')} 
                className={`flex items-center space-x-3 px-4 py-3 w-full rounded-lg transition-colors ${
                  activeSection === 'payments' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <DollarSign size={20} />
                <span className="font-medium">Earnings</span>
              </button>
              <button 
                onClick={() => setActiveSection('ratings')} 
                className={`flex items-center space-x-3 px-4 py-3 w-full rounded-lg transition-colors ${
                  activeSection === 'ratings' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Star size={20} />
                <span className="font-medium">Ratings</span>
              </button>
              <button 
                onClick={() => setActiveSection('settings')} 
                className={`flex items-center space-x-3 px-4 py-3 w-full rounded-lg transition-colors ${
                  activeSection === 'settings' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings size={20} />
                <span className="font-medium">Settings</span>
              </button>
            </nav>
          </div>
          
          {user && (
            <div className="pt-4 border-t">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="font-medium text-blue-800">Driver Account</div>
                <div className="text-sm text-blue-600 mt-1">{user.nom} {user.prenom}</div>
                <div className="mt-3 text-xs text-blue-500">
                  {ratings.length > 0 ? (
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-500 mr-1" fill="#facc15" />
                      {(ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)}/5
                      <span className="ml-1">({ratings.length} ratings)</span>
                    </div>
                  ) : (
                    "No ratings yet"
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeSection === 'trips' && 'Your Trips'}
              {activeSection === 'requests' && 'Booking Requests'}
              {activeSection === 'payments' && 'Earnings & Payments'}
              {activeSection === 'ratings' && 'Passenger Ratings'}
              {activeSection === 'settings' && 'Account Settings'}
            </h1>
          </div>
          
          {renderMainContent()}
        </div>
      </div>
    </>
  );
}

export default DriverDashboard;