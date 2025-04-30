import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function AdminEditTrip() {
  const [trip, setTrip] = useState({
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
    status: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();
  const navigate = useNavigate();

  // Map status integers to string representations
  const statusMap = {
    0: 'Future',
    1: 'Ongoing',
    2: 'Completed',
  };

  useEffect(() => {
    const fetchTrip = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5090/view-trip/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch trip');
        const data = await response.json();
        setTrip({
          ville_depart: data.ville_depart || '',
          ville_arriver: data.ville_arriver || '',
          date_depart: data.date_depart ? data.date_depart.split('T')[0] : '',
          heure_depart: data.heure_depart || '',
          date_arrivee: data.date_arrivee ? data.date_arrivee.split('T')[0] : '',
          heure_arrivee: data.heure_arrivee || '',
          prix: data.prix || '',
          nbr_places: data.nbr_places || '',
          fumer: !!data.fumer,
          animaux: !!data.animaux,
          musique: !!data.musique,
          marque: data.marque || '',
          matricule: data.matricule || '',
          status: data.status || 0,
        });
      } catch (error) {
        console.error('Error fetching trip:', error);
        setError('Failed to load trip details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrip();
  }, [id, user.token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTrip((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5090/edit-trip/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ville_depart: trip.ville_depart,
          ville_arriver: trip.ville_arriver,
          date_depart: trip.date_depart,
          heure_depart: trip.heure_depart,
          date_arrivee: trip.date_arrivee || null,
          heure_arrivee: trip.heure_arrivee || null,
          prix: parseFloat(trip.prix),
          nbr_places: parseInt(trip.nbr_places),
          fumer: trip.fumer ? 1 : 0,
          animaux: trip.animaux ? 1 : 0,
          musique: trip.musique ? 1 : 0,
          marque: trip.marque || null,
          matricule: trip.matricule || null,
          status: parseInt(trip.status),
        }),
      });
      if (!response.ok) throw new Error('Failed to update trip');
      navigate('/admin');
    } catch (error) {
      console.error('Error updating trip:', error);
      setError('Failed to update trip. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-gray-500">Loading trip...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2 text-gray-800">Edit Trip</h1>
          <p className="text-gray-600">Update the details of the selected trip</p>
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200 shadow-sm"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Trips
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Departure City</label>
              <input
                type="text"
                name="ville_depart"
                value={trip.ville_depart}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Destination City</label>
              <input
                type="text"
                name="ville_arriver"
                value={trip.ville_arriver}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Departure Date</label>
              <input
                type="date"
                name="date_depart"
                value={trip.date_depart}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Departure Time</label>
              <input
                type="time"
                name="heure_depart"
                value={trip.heure_depart}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Arrival Date</label>
              <input
                type="date"
                name="date_arrivee"
                value={trip.date_arrivee}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Arrival Time</label>
              <input
                type="time"
                name="heure_arrivee"
                value={trip.heure_arrivee}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Price ($)</label>
              <input
                type="number"
                name="prix"
                value={trip.prix}
                onChange={handleChange}
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
                name="nbr_places"
                value={trip.nbr_places}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Status</label>
              <select
                name="status"
                value={trip.status}
                onChange={handleChange}
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
                name="marque"
                value={trip.marque}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">License Plate</label>
              <input
                type="text"
                name="matricule"
                value={trip.matricule}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                name="fumer"
                checked={trip.fumer}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-gray-700 font-medium">Smoking Allowed</label>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                name="animaux"
                checked={trip.animaux}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-gray-700 font-medium">Pets Allowed</label>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                name="musique"
                checked={trip.musique}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-gray-700 font-medium">Music Allowed</label>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminEditTrip;