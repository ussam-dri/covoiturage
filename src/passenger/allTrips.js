import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, DollarSign } from 'lucide-react';
import { Header } from '../utils/Header';
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllTrips() {
  const { user } = useSelector((state) => state.auth);

  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: ''
  });

  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('http://localhost:5090/trips');
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };
    fetchTrips();
  }, []);
  const bookTrip = async (id_trajet, id_user) => {
    // Prevent drivers from booking trips
    if (user.role === "driver") {
      toast.error("Drivers cannot book trips."); // ❌ error toast for drivers
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5090/book-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ id_trajet, id_user: user.id })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast.success(result.message); // ✅ success toast
      } else {
        toast.error(result.error); // ❌ error toast
      }
    } catch (error) {
      console.error('Error booking trip:', error);
      toast.error('An error occurred while booking the trip.'); // ❌ fallback toast
    }
  };
  
  
  
  const filteredTrips = trips.filter(trip =>
    (!searchParams.origin || trip.ville_depart.toLowerCase().includes(searchParams.origin.toLowerCase())) &&
    (!searchParams.destination || trip.ville_arriver.toLowerCase().includes(searchParams.destination.toLowerCase())) &&
    (!searchParams.date || trip.date_depart.includes(searchParams.date))
  );

  // Get user_id from localStorage or context
  const user_id = localStorage.getItem('user_id'); // Replace with your preferred way to get user ID

  return (
    <>  <ToastContainer />
      <Header variant='passenger'></Header>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Find a Trip</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Origin</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="text"
                    value={searchParams.origin}
                    onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="From where?"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Destination</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="text"
                    value={searchParams.destination}
                    onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="To where?"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="date"
                    value={searchParams.date}
                    onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Trips Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Available Trips</h2>
              <div className="space-y-6">
                {filteredTrips.slice(0, 10).map((trip) => (
                  <div
                    key={trip.id_trajet}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        {/* Trip info display */}
                        <div className="flex items-center mb-2">
                          <MapPin className="text-gray-500 mr-2" size={20} />
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md font-medium">{trip.ville_depart}</span>
                          <span className="mx-2 text-gray-600">to</span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md font-medium">{trip.ville_arriver}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="mr-2" size={16} />
                          <span>{new Date(trip.date_depart).toLocaleDateString()} at {trip.heure_depart.slice(0, 5)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center text-green-600">
                          <DollarSign size={20} />
                          {trip.prix} 
                        </span>
                        <button
                          onClick={() => bookTrip(trip.id_trajet, user_id)}  // Trigger bookTrip with correct params
                          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <div>
                        {trip.nbr_places} seats left | Smoking: {trip.fumer ? 'Yes' : 'No'} | Pets: {trip.animaux ? 'Yes' : 'No'} | Music: {trip.musique ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredTrips.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No trips found matching your criteria.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AllTrips;
