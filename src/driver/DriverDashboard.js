import React, { useState, useEffect } from 'react';
import { Header } from '../utils/Header';
import {
  Users, Settings, MapPin, Calendar, DollarSign, Star, Car, Eye, Pencil, Trash2
} from 'lucide-react';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

function DriverDashboard() {
  const [activeSection, setActiveSection] = useState('trips');
  const [tripView, setTripView] = useState('all'); // 'all', 'future', 'completed'
  const [trips, setTrips] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
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
      }
    };
    fetchTrips();
  }, []);

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
      console.log(id);

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
    return true; // all trips
  });

  const renderTrips = () => (
    <div className="space-y-6">
      {filteredTrips.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No {tripView} trips to display.
        </div>
      ) : (
        filteredTrips.map((trip) => (
          <div
            key={trip.id_trajet}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="text-gray-500" size={20} />
                <span className="font-medium">
                  {trip.ville_depart} → {trip.ville_arriver}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="flex items-center text-green-600">
                  <DollarSign size={20} />
                  {trip.prix} €
                </span>

                {/* View Button */}
                <button
                  onClick={() => navigate(`/driver/trip/view/${trip.id_trajet}`)}
                  className="text-blue-600 hover:text-blue-800"
                  title="View Trip"
                >
                  <Eye size={20} />
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => navigate(`/driver/trip/edit/${trip.id_trajet}`)}
                  className="text-yellow-500 hover:text-yellow-700"
                  title="Edit Trip"
                >
                  <Pencil size={20} />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(trip.id_trajet)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete Trip"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{new Date(trip.date_depart).toLocaleDateString()} at {trip.heure_depart.slice(0, 5)}</span>
              </div>
              <div>
                {trip.nbr_places} seats | Smoking: {trip.fumer ? 'Yes' : 'No'} | Pets: {trip.animaux ? 'Yes' : 'No'} | Music: {trip.musique ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderMainContent = () => {
    if (activeSection === 'trips') {
      return (
        <div>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setTripView('all')}
              className={`px-4 py-2 rounded-md ${tripView === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              All Trips
            </button>
            <button
              onClick={() => setTripView('future')}
              className={`px-4 py-2 rounded-md ${tripView === 'future' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Future Trips
            </button>
            <button
              onClick={() => setTripView('completed')}
              className={`px-4 py-2 rounded-md ${tripView === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Completed Trips
            </button>
          </div>
          {renderTrips()}
        </div>
      );
    }

    return (
      <div className="text-gray-700 text-lg font-semibold p-6 bg-white rounded-lg shadow">
        {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} section coming soon...
      </div>
    );
  };

  return (
    <>
      <Header variant="driver" />
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-6">Dashboard</h2>
            <nav className="space-y-4">
              <button onClick={() => setActiveSection('trips')} className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <Car size={20} />
                <span>Trips</span>
              </button>
              <button onClick={() => setActiveSection('payments')} className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <DollarSign size={20} />
                <span>Payments</span>
              </button>
              <button onClick={() => setActiveSection('ratings')} className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <Star size={20} />
                <span>Ratings</span>
              </button>
              <button onClick={() => setActiveSection('settings')} className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <Settings size={20} />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderMainContent()}
        </div>
      </div>
    </>
  );
}

export default DriverDashboard;
