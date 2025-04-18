import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, DollarSign, Music, Cigarette, Dog, Users, ArrowRight, Star } from 'lucide-react';
import { Header } from '../utils/Header';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../utils/Footer';
import { useSelector } from "react-redux";

function AllTrips() {
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: ''
  });

  const [trips, setTrips] = useState([]);
  const { user } = useSelector((state) => state.auth);

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
    if (user.role === "driver") {
      toast.error("Drivers cannot book trips.");
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
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error booking trip:', error);
      toast.error('An error occurred while booking the trip.');
    }
  };

  const filteredTrips = trips.filter(trip =>
    (!searchParams.origin || trip.ville_depart?.toLowerCase().includes(searchParams.origin.toLowerCase())) &&
    (!searchParams.destination || trip.ville_arriver?.toLowerCase().includes(searchParams.destination.toLowerCase())) &&
    (!searchParams.date || trip.date_depart?.includes(searchParams.date))
  );

  return (
    <>
      <Header variant='passenger' />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Your Perfect Ride</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['origin', 'destination', 'date'].map((field) => (
                <div key={field} className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                    {field}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {field === 'date' ? (
                        <Calendar className="h-5 w-5 text-blue-500" />
                      ) : (
                        <MapPin className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <input
                      type={field === 'date' ? 'date' : 'text'}
                      value={searchParams[field]}
                      onChange={(e) => setSearchParams({ ...searchParams, [field]: e.target.value })}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               placeholder-gray-400 transition duration-150 ease-in-out"
                      placeholder={field === 'origin' ? 'From where?' : field === 'destination' ? 'To where?' : ''}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredTrips.filter(trip => trip.status === 0).map((trip) => (
              <div key={trip.id_trajet} 
                   className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2">
                          <MapPin className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="mx-2 font-semibold text-gray-800">{trip.ville_depart}</span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                      <div className="flex items-center">
                        <div className="bg-green-100 rounded-full p-2">
                          <MapPin className="h-6 w-6 text-green-600" />
                        </div>
                        <span className="mx-2 font-semibold text-gray-800">{trip.ville_arriver}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-600">
                          {new Date(trip.date_depart).toLocaleDateString()} at {trip.heure_depart.slice(0, 5)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-700">Driver: </span>
                        <a
                          href={`/driverProfile/${trip.id_driver}`}
                          className="ml-1 text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          {trip.nom} {trip.prenom}
                        </a>
                        <div className="flex items-center ml-3 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1">{trip.rating ?? 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{trip.nbr_places} seats</span>
                      </div>
                      {[
                        { icon: <Music className="h-4 w-4" />, value: trip.musique, label: 'Music' },
                        { icon: <Cigarette className="h-4 w-4" />, value: trip.fumer, label: 'Smoking' },
                        { icon: <Dog className="h-4 w-4" />, value: trip.animaux, label: 'Pets' },
                      ].map(({ icon, value, label }) => (
                        <div key={label} 
                             className={`flex items-center gap-1 px-2 py-1 rounded-full 
                                      ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {icon}
                          <span className="text-xs">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex items-center text-2xl font-bold text-green-600">
                      <DollarSign className="h-6 w-6" />
                      <span>{trip.prix}</span>
                    </div>
                    <button
                      onClick={() => bookTrip(trip.id_trajet, user.id)}
                      className="w-full md:w-auto bg-blue-600 text-white py-2 px-6 rounded-xl
                               hover:bg-blue-700 transform hover:scale-105 transition-all duration-200
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredTrips.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-xl">No trips found matching your criteria.</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
      <Footer></Footer>
    </>
  );
}

export default AllTrips;