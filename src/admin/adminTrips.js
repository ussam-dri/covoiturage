import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

function AdminTrips() {
  const [trips, setTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTrip, setNewTrip] = useState({
    ville_depart: '',
    ville_arriver: '',
    date_depart: '',
    heure_depart: '',
    date_arrivee: '',
    heure_arrivee: '',
    prix: '',
    nbr_places: '',
    fumer: false,
    animaux: false,
    musique: false,
    marque: '',
    matricule: '',
    id_driver: '',
    status: 0,
  });
  const [error, setError] = useState('');

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Map status integers to string representations
  const statusMap = {
    0: 'Future',
    1: 'Ongoing',
    2: 'Completed',
  };

  // Fetch all trips on mount
  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5090/trips', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch trips');
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setError('Failed to load trips. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [user.token]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter trips based on search query
  const filteredTrips = trips.filter((trip) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      trip.ville_arriver?.toLowerCase().includes(query) ||
      trip.ville_depart?.toLowerCase().includes(query) ||
      statusMap[trip.status]?.toLowerCase().includes(query)
    );
  });

  // Handle add trip form submission
  const handleAddTrip = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5090/add-trip', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ville_depart: newTrip.ville_depart,
          ville_arriver: newTrip.ville_arriver,
          date_depart: newTrip.date_depart,
          heure_depart: newTrip.heure_depart,
          date_arrivee: newTrip.date_arrivee || null,
          heure_arrivee: newTrip.heure_arrivee || null,
          prix: parseFloat(newTrip.prix),
          nbr_places: parseInt(newTrip.nbr_places),
          fumer: newTrip.fumer ? 1 : 0,
          animaux: newTrip.animaux ? 1 : 0,
          musique: newTrip.musique ? 1 : 0,
          marque: newTrip.marque || null,
          matricule: newTrip.matricule || null,
          id_driver: parseInt(newTrip.id_driver),
          status: parseInt(newTrip.status),
        }),
      });
      if (!response.ok) throw new Error('Failed to add trip');
      const addedTrip = await response.json();
      setTrips([...trips, { ...newTrip, id_trajet: addedTrip.tripId }]);
      setShowAddModal(false);
      setNewTrip({
        ville_depart: '',
        ville_arriver: '',
        date_depart: '',
        heure_depart: '',
        date_arrivee: '',
        heure_arrivee: '',
        prix: '',
        nbr_places: '',
        fumer: false,
        animaux: false,
        musique: false,
        marque: '',
        matricule: '',
        id_driver: '',
        status: 0,
      });
      setError('');
    } catch (error) {
      console.error('Error adding trip:', error);
      setError('Failed to add trip. Please try again.');
    }
  };

  // Handle delete trip
  const handleDeleteTrip = async (tripId) => {
    try {
      const response = await fetch(`http://localhost:5090/delete-trip/${tripId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete trip');
      setTrips(trips.filter((trip) => trip.id_trajet !== tripId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting trip:', error);
      setError('Failed to delete trip. Please try again.');
    }
  };

  // Handle view trip
  const handleViewTrip = (tripId) => {
    navigate(`/admin/viewTrip/${tripId}`);
  };

  // Handle edit trip
  const handleEditTrip = (tripId) => {
    navigate(`/admin/editTrip/${tripId}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2 text-gray-800">Trips List</h1>
          <p className="text-gray-600">Manage all trips in the system</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200 shadow-sm"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          ADD TRIP
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap justify-between gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search trips..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-6 py-4 px-6 border-b border-gray-200 bg-gray-50">
          <div className="text-gray-500 font-medium">DESTINATION</div>
          <div className="text-gray-500 font-medium">DEPARTURE</div>
          <div className="text-gray-500 font-medium">DATE</div>
          <div className="text-gray-500 font-medium">PRICE</div>
          <div className="text-gray-500 font-medium">STATUS</div>
          <div className="text-gray-500 font-medium text-right">ACTIONS</div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gray-500">Loading trips...</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTrips.length === 0 ? (
              <div className="py-10 text-center text-gray-500">No trips found</div>
            ) : (
              filteredTrips.map((trip) => (
                <div
                  key={trip.id_trajet}
                  className="grid grid-cols-6 py-4 px-6 items-center hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-800">
                    {trip.ville_arriver}
                  </div>
                  <div className="font-medium text-gray-800">
                    {trip.ville_depart}
                  </div>
                  <div className="text-gray-700">
                    {new Date(trip.date_depart).toLocaleDateString()}
                  </div>
                  <div className="text-gray-700">${trip.prix}</div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        trip.status === 0
                          ? 'bg-blue-100 text-blue-700'
                          : trip.status === 1
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {statusMap[trip.status]}
                    </span>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleViewTrip(trip.id_trajet)}
                      className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors duration-200"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEditTrip(trip.id_trajet)}
                      className="text-gray-400 hover:text-green-600 p-1 rounded-full hover:bg-green-50 transition-colors duration-200"
                      title="Edit Trip"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(trip)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                      title="Delete Trip"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Delete confirmation popup */}
                  {deleteConfirm && deleteConfirm.id_trajet === trip.id_trajet && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                        <p className="mb-6">
                          Are you sure you want to delete the trip from{' '}
                          {trip.ville_depart} to {trip.ville_arriver}? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteTrip(trip.id_trajet)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Trip Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Add New Trip</h3>
            <form onSubmit={handleAddTrip}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Departure City</label>
                <input
                  type="text"
                  value={newTrip.ville_depart}
                  onChange={(e) => setNewTrip({ ...newTrip, ville_depart: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Destination City</label>
                <input
                  type="text"
                  value={newTrip.ville_arriver}
                  onChange={(e) => setNewTrip({ ...newTrip, ville_arriver: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Departure Date</label>
                <input
                  type="date"
                  value={newTrip.date_depart}
                  onChange={(e) => setNewTrip({ ...newTrip, date_depart: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Departure Time</label>
                <input
                  type="time"
                  value={newTrip.heure_depart}
                  onChange={(e) => setNewTrip({ ...newTrip, heure_depart: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Arrival Date</label>
                <input
                  type="date"
                  value={newTrip.date_arrivee}
                  onChange={(e) => setNewTrip({ ...newTrip, date_arrivee: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Arrival Time</label>
                <input
                  type="time"
                  value={newTrip.heure_arrivee}
                  onChange={(e) => setNewTrip({ ...newTrip, heure_arrivee: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Price ($)</label>
                <input
                  type="number"
                  value={newTrip.prix}
                  onChange={(e) => setNewTrip({ ...newTrip, prix: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Available Seats</label>
                <input
                  type="number"
                  value={newTrip.nbr_places}
                  onChange={(e) => setNewTrip({ ...newTrip, nbr_places: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Driver ID</label>
                <input
                  type="number"
                  value={newTrip.id_driver}
                  onChange={(e) => setNewTrip({ ...newTrip, id_driver: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Status</label>
                <select
                  value={newTrip.status}
                  onChange={(e) => setNewTrip({ ...newTrip, status: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Future</option>
                  <option value={1}>Ongoing</option>
                  <option value={2}>Completed</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Car Brand</label>
                <input
                  type="text"
                  value={newTrip.marque}
                  onChange={(e) => setNewTrip({ ...newTrip, marque: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">License Plate</label>
                <input
                  type="text"
                  value={newTrip.matricule}
                  onChange={(e) => setNewTrip({ ...newTrip, matricule: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  checked={newTrip.fumer}
                  onChange={(e) => setNewTrip({ ...newTrip, fumer: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-gray-700 font-medium">Smoking Allowed</label>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  checked={newTrip.animaux}
                  onChange={(e) => setNewTrip({ ...newTrip, animaux: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-gray-700 font-medium">Pets Allowed</label>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  checked={newTrip.musique}
                  onChange={(e) => setNewTrip({ ...newTrip, musique: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-gray-700 font-medium">Music Allowed</label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTrips;