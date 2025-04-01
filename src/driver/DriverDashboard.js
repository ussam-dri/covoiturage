import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Calendar, Users, Settings } from 'lucide-react';
import { addTrip, updateTrip } from '../store/slices/tripsSlice';

function DriverDashboard() {
  const [newTrip, setNewTrip] = useState({
    origin: '',
    destination: '',
    date: '',
    seats: 4,
    price: 0
  });
  
  const trips = useSelector(state => state.trips.trips);
  const dispatch = useDispatch();

  const handleAddTrip = (e) => {
    e.preventDefault();
    dispatch(addTrip({
      id: Date.now().toString(),
      ...newTrip,
      status: 'scheduled'
    }));
    setNewTrip({
      origin: '',
      destination: '',
      date: '',
      seats: 4,
      price: 0
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Add New Trip Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Trip</h2>
            <form onSubmit={handleAddTrip}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Origin</label>
                  <input
                    type="text"
                    value={newTrip.origin}
                    onChange={(e) => setNewTrip({ ...newTrip, origin: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Destination</label>
                  <input
                    type="text"
                    value={newTrip.destination}
                    onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="datetime-local"
                    value={newTrip.date}
                    onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Available Seats</label>
                  <input
                    type="number"
                    value={newTrip.seats}
                    onChange={(e) => setNewTrip({ ...newTrip, seats: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price per Seat</label>
                  <input
                    type="number"
                    value={newTrip.price}
                    onChange={(e) => setNewTrip({ ...newTrip, price: parseFloat(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create Trip
                </button>
              </div>
            </form>
          </div>

          {/* My Trips */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">My Trips</h2>
            <div className="space-y-4">
              {trips.map(trip => (
                <div key={trip.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="text-gray-500" size={20} />
                      <span>{trip.origin} → {trip.destination}</span>
                    </div>
                    <span className={\`px-2 py-1 rounded-full text-sm \${
                      trip.status === 'completed' ? 'bg-green-100 text-green-800' :
                      trip.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }\`}>
                      {trip.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>{new Date(trip.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users size={16} />
                      <span>{trip.seats} seats available</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;