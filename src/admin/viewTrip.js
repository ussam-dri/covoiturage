import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function ViewTrip() {
  const [trip, setTrip] = useState(null);
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
        setTrip(data);
      } catch (error) {
        console.error('Error fetching trip:', error);
        setError('Failed to load trip details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrip();
  }, [id, user.token]);

  if (isLoading) {
    return <div className="py-20 text-center text-gray-500">Loading trip...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2 text-gray-800">Trip Details</h1>
          <p className="text-gray-600">View details of the selected trip</p>
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200 shadow-sm"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Trips
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-gray-500 font-medium">Departure City</h3>
            <p className="text-gray-800 font-medium">{trip.ville_depart}</p>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium">Destination City</h3>
            <p className="text-gray-800 font-medium">{trip.ville_arriver}</p>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium">Departure Date</h3>
            <p className="text-gray-800 font-medium">
              {new Date(trip.date_depart).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium">Departure Time</h3>
            <p className="text-gray-800 font-medium">{trip.heure_depart}</p>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium">Arrival Date</h3>
            <p className="text-gray-800 font-medium">
              {trip.date_arrivee ? new Date(trip.date_arrivee).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium">Arrival Time</h3>
            <p className="text-gray-800 font-medium">{trip.heure_arrivee || 'N/A'}</p>
          </div>
          <div>
          <h3 className="text-gray-500 font-medium">Car Brand</h3>
          <p className="text-gray-800 font-medium">{trip.marque || 'N/A'}</p>
        </div>
        <div>
        <h3 className="text-gray-500 font-medium">License Plate</h3>
        <p className="text-gray-800 font-medium">{trip.matricule || 'N/A'}</p>
      </div>
          <div>
            <h3 className="text-gray-500 font-medium">Price</h3>
            <p className="text-gray-800 font-medium">${trip.prix}</p>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium">Available Seats</h3>
            <p className="text-gray-800 font-medium">{trip.nbr_places}</p>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium">Status</h3>
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
          <div>
            <h3 className="text-gray-500 font-medium">Driver ID</h3>
            <p className="text-gray-800 font-medium">{trip.id_driver}</p>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium">Smoking Allowed</h3>
            <p className="text-gray-800 font-medium">{trip.fumer ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium">Pets Allowed</h3>
            <p className="text-gray-800 font-medium">{trip.animaux ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium">Music Allowed</h3>
            <p className="text-gray-800 font-medium">{trip.musique ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium">Car Brand</h3>
            <p className="text-gray-800 font-medium">{trip.marque || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium">License Plate</h3>
            <p className="text-gray-800 font-medium">{trip.matricule || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTrip;