import React, { useState, useEffect } from 'react';
import { Header } from '../utils/Header';
import {
  Users, Settings, MapPin, Calendar, DollarSign, Car, Star, Clock,
  ChevronRight, Bell, Briefcase, HelpCircle, LogOut, Search, Filter,
  AlertCircle, CheckCircle, CreditCard, User, Home, Menu, X
} from 'lucide-react';
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function PassengerDashboard() {
  const [activeSection, setActiveSection] = useState('trips');
  const [tripView, setTripView] = useState('all');
  const [trips, setTrips] = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user || !user.id || !user.token) return;

    const fetchTrips = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5090/passenger-trips/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }
        
        const data = await response.json();
        setTrips(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setError('Failed to load trips. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrips();
  }, [user]);

  const handleCancelTrip = async (tripId) => {
    try {
      const response = await fetch(`http://localhost:5090/cancel-trip/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel trip');
      }

      // Update local state to reflect the cancellation
      setTrips(trips.filter(trip => trip.id_trajet !== tripId));
      toast.success('Trip cancelled successfully');
    } catch (error) {
      console.error('Error cancelling trip:', error);
      toast.error('Failed to cancel trip. Please try again.');
    }
  };

  const filteredTrips = trips.filter((trip) => {
    const status = parseInt(trip.status);
    if (tripView === 'future') return status === 0;
    if (tripView === 'current') return status === 1;
    if (tripView === 'completed') return status === 2;
    return true;
  });

  const getStatusBadge = (status) => {
    switch (parseInt(status)) {
      case 0:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={14} className="mr-1" />
            Upcoming
          </span>
        );
      case 1:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Car size={14} className="mr-1" />
            In Progress
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={14} className="mr-1" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertCircle size={14} className="mr-1" />
            Unknown
          </span>
        );
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          onClick={() => setRating(i)}
          className={`focus:outline-none ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          <Star size={24} fill={i <= rating ? 'currentColor' : 'none'} />
        </button>
      );
    }
    return stars;
  };

  const renderTrips = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading trips...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      );
    }

    if (filteredTrips.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Car className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No {tripView} trips</h3>
          <p className="text-gray-500">
            {tripView === 'all' 
              ? "You haven't booked any trips yet."
              : tripView === 'future' 
                ? "You don't have any upcoming trips scheduled."
                : tripView === 'current'
                  ? "You don't have any trips in progress."
                  : "You don't have any completed trips."}
          </p>
          {tripView !== 'all' && (
            <button
              onClick={() => setTripView('all')}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              View all trips
              <ChevronRight size={16} className="ml-1" />
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4 mt-6">
        <ToastContainer />
        {filteredTrips.map((trip) => (
          <div
            key={trip.id_trajet}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
          >
            <div className="border-l-4 border-blue-500 px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <div className="flex items-center text-lg font-medium text-blue-600 mb-1">
                  <MapPin className="flex-shrink-0 mr-1.5" size={18} />
                  <span>{trip.ville_depart}</span>
                  <ChevronRight className="mx-1 text-gray-400" size={16} />
                  <span>{trip.ville_arriver}</span>
                </div>
                <div className="flex flex-wrap items-center text-sm text-gray-500">
                  <div className="flex items-center mr-4 mb-1 sm:mb-0">
                    <Calendar className="mr-1" size={14} />
                    <span>{new Date(trip.date_depart).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center mr-4 mb-1 sm:mb-0">
                    <Clock className="mr-1" size={14} />
                    <span>{trip.heure_depart.slice(0, 5)}</span>
                  </div>
                  <div className="flex items-center mr-4 mb-1 sm:mb-0">
                    <Users className="mr-1" size={14} />
                    <span>{trip.nbr_places} seats</span>
                  </div>
                  {getStatusBadge(trip.status)}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="flex items-center justify-center bg-green-50 rounded-md px-3 py-1 text-green-700 font-medium">
                  <DollarSign size={16} className="mr-1" />
                  {trip.prix} €
                </div>
                <a 
                  href={`/passenger/trip/view/${trip.id_trajet}`}
                  className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Details
                </a>
                {parseInt(trip.status) === 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this trip?')) {
                        handleCancelTrip(trip.id_trajet);
                      }
                    }}
                    className="flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
                  >
                    <X size={16} className="mr-1" />
                    Cancel Trip
                  </button>
                )}
                {parseInt(trip.status) === 2 && (
                  <button
                    onClick={() => {
                      setSelectedTrip(trip);
                      setShowRatingModal(true);
                    }}
                    className="flex items-center justify-center bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    <Star size={16} className="mr-1" />
                    Rate Driver
                  </button>
                )}
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-sm">
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                <span className="inline-flex items-center text-gray-600">
                  {trip.fumer 
                    ? <CheckCircle size={16} className="mr-1 text-green-500" /> 
                    : <X size={16} className="mr-1 text-red-500" />}
                  Smoking
                </span>
                <span className="inline-flex items-center text-gray-600">
                  {trip.animaux 
                    ? <CheckCircle size={16} className="mr-1 text-green-500" /> 
                    : <X size={16} className="mr-1 text-red-500" />}
                  Pets
                </span>
                <span className="inline-flex items-center text-gray-600">
                  {trip.musique 
                    ? <CheckCircle size={16} className="mr-1 text-green-500" /> 
                    : <X size={16} className="mr-1 text-red-500" />}
                  Music
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderMainContent = () => {
    if (activeSection === 'trips') {
      return (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
            <p className="text-gray-600 mt-1">Manage your upcoming, current, and past trips</p>
          </div>
          
          <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTripView('all')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  tripView === 'all' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                All Trips
              </button>
              <button
                onClick={() => setTripView('future')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  tripView === 'future' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                <Clock size={16} className="inline mr-1" />
                Upcoming
              </button>
              <button
                onClick={() => setTripView('current')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  tripView === 'current' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                <Car size={16} className="inline mr-1" />
                In Progress
              </button>
              <button
                onClick={() => setTripView('completed')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  tripView === 'completed' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                <CheckCircle size={16} className="inline mr-1" />
                Completed
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="text-gray-400" size={16} />
              </div>
              <input
                type="text"
                placeholder="Search trips..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {renderTrips()}
        </>
      );
    }

    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        </h1>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            {activeSection === 'profile' && <User className="text-blue-600" size={32} />}
            {activeSection === 'payments' && <CreditCard className="text-blue-600" size={32} />}
            {activeSection === 'settings' && <Settings className="text-blue-600" size={32} />}
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} section
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            This feature is coming soon. We're working hard to bring you the best experience possible.
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header variant="passenger" />
      <div className="min

-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed bottom-4 right-4 z-20 bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          <Menu size={24} />
        </button>

        {/* Sidebar */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 transform transition-transform duration-300 ease-in-out
          w-64 bg-white shadow-md fixed md:static h-full z-10
        `}>
          <div className="p-6">
            {user && (
              <div className="flex items-center space-x-3 mb-8 pb-6 border-b">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.prenom} {user.nom}</p>
                  <p className="text-sm text-gray-500">Passenger</p>
                </div>
              </div>
            )}
            
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Main Menu</h2>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveSection('trips')} 
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium ${
                  activeSection === 'trips' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Car size={18} className="mr-3" />
                <span>My Trips</span>
              </button>
              <button 
                onClick={() => setActiveSection('profile')} 
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium ${
                  activeSection === 'profile' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <User size={18} className="mr-3" />
                <span>Profile</span>
              </button>
              <button 
                onClick={() => setActiveSection('payments')} 
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium ${
                  activeSection === 'payments' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <CreditCard size={18} className="mr-3" />
                <span>Payments</span>
              </button>
              <button 
                onClick={() => setActiveSection('settings')} 
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium ${
                  activeSection === 'settings' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Settings size={18} className="mr-3" />
                <span>Settings</span>
              </button>
            </nav>
            
            <hr className="my-6" />
            
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Support</h2>
            <nav className="space-y-1">
              <button className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                <HelpCircle size={18} className="mr-3" />
                <span>Help Center</span>
              </button>
              <button className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                <Bell size={18} className="mr-3" />
                <span>Notifications</span>
              </button>
              <button className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50">
                <LogOut size={18} className="mr-3" />
                <span>Log Out</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {renderMainContent()}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Rate Your Driver</h2>
              <button 
                onClick={() => setShowRatingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                How was your experience with the driver for your trip from {selectedTrip?.ville_depart} to {selectedTrip?.ville_arriver}?
              </p>
              
              <label className="block mb-2 font-medium text-gray-700">Your Rating</label>
              <div className="flex items-center mb-4">
                {renderStars()}
                <span className="ml-2 text-gray-700 font-medium">{rating}/5</span>
              </div>

              <label className="block mb-2 font-medium text-gray-700">Review (Optional)</label>
              <textarea
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Share your experience with this driver..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setSelectedTrip(null);
                  setRating(5);
                  setMessage('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch('http://localhost:5090/passenger/rate-driver', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                      },
                      body: JSON.stringify({
                        id_driver: selectedTrip.id_driver,
                        id_passenger: user.id,
                        rating: parseInt(rating),
                        message,
                      }),
                    });

                    if (!res.ok) throw new Error('Failed to submit rating');

                    setShowRatingModal(false);
                    setSelectedTrip(null);
                    setRating(5);
                    setMessage('');
                    toast.success('Thank you for your feedback!');
                  } catch (err) {
                    console.error(err);
                    toast.error('Error submitting rating. Please try again.');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PassengerDashboard;