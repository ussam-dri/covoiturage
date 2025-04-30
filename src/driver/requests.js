import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MapPin, Calendar, Users, Check, X, ChevronRight } from 'lucide-react';

function Requests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("user", user.id, "token", user.token);
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5090/driver/booking-requests/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch booking requests');
        const data = await response.json();
        setRequests(data);
      } catch (err) {
        console.error('Error fetching booking requests:', err);
        setError('Failed to load booking requests. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id && user?.token) {
      fetchRequests();
    }
  }, [user?.id, user?.token]);

  const handleBookingAction = async (bookingId, action) => {
    try {
      const response = await fetch(`http://localhost:5090/driver/booking-action`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ booking_id: bookingId, action }),
      });
      if (!response.ok) throw new Error(`Failed to ${action} booking request`);
      const result = await response.json();
      setRequests(requests.map(req => 
        req.id_booking === bookingId ? { ...req, status: action === 'accept' ? 'accepted' : 'rejected' } : req
      ));
    } catch (err) {
      console.error(`Error performing ${action} on booking request:`, err);
      setError(`Failed to ${action} booking request. Please try again.`);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'pending') return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
    if (status === 'accepted') return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Accepted</span>;
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rejected</span>;
  };

  const renderRequests = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-red-600">{error}</p>
        </div>
      );
    }

    if (requests.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">No booking requests</h3>
          <p className="text-gray-500 mt-2">Booking requests from passengers will appear here.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id_booking}
            className="border rounded-lg p-5 hover:shadow transition-shadow bg-white"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-full">
                  <MapPin className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {request.ville_depart} <ChevronRight size={16} className="inline text-gray-400" /> {request.ville_arriver}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(request.date_depart).toLocaleDateString()}</span>
                    </div>
                    <div>{request.heure_depart.slice(0, 5)}</div>
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold text-green-600">{request.prix} €</div>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-1">
                <Users size={16} className="text-gray-500" />
                <span>Passenger: {request.passenger_prenom} {request.passenger_nom}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-medium">Email:</span>
                <span>{request.passenger_email}</span>
              </div>
            </div>

            {request.status === 'pending' && (
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleBookingAction(request.id_booking, 'accept')}
                  className="flex items-center space-x-1 px-3 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                  title="Accept Request"
                >
                  <Check size={16} />
                  <span>Accept</span>
                </button>
                <button
                  onClick={() => handleBookingAction(request.id_booking, 'reject')}
                  className="flex items-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                  title="Reject Request"
                >
                  <X size={16} />
                  <span>Reject</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderRequests()}
    </div>
  );
}

export default Requests;