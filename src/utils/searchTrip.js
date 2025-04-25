import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, ArrowRight, DollarSign, Music, Cigarette, Dog, Star } from "lucide-react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const SearchTrip = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [departureError, setDepartureError] = useState("");
  const [destinationError, setDestinationError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [driversInfo, setDriversInfo] = useState({});
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookedTripIds, setBookedTripIds] = useState(new Set());
  const { user } = useSelector((state) => state.auth);

  const fetchSuggestions = async (query, type) => {
    if (query.length < 2) return;

    try {
      const res = await fetch(`http://localhost:5090/autocomplete?query=${query}`);
      const data = await res.json();
      type === "departure" ? setDepartureSuggestions(data) : setDestinationSuggestions(data);
    } catch (err) {
      console.error("Autocomplete error:", err);
    }
  };

  const handleDepartureChange = (e) => {
    const value = e.target.value;
    setDeparture(value);
    setDepartureError("");
    if (value === destination) {
      setDestinationError("Destination cannot be the same as departure.");
    } else {
      setDestinationError("");
    }
    fetchSuggestions(value, "departure");
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    if (!departure.trim()) {
      setDestinationError("Please enter a departure city first.");
      return;
    }
    setDestination(value);
    if (value === departure) {
      setDestinationError("Destination cannot be the same as departure.");
    } else {
      setDestinationError("");
    }
    fetchSuggestions(value, "destination");
  };

  const handleDepartureSelection = (city) => {
    setDeparture(city);
    setDepartureSuggestions([]);
    setDepartureError("");
    if (city === destination) {
      setDestination("");
      setDestinationError("Please enter a different destination.");
    }
  };

  const handleDestinationSelection = (city) => {
    if (city === departure) {
      setDestinationError("Destination cannot be the same as departure.");
      setDestinationSuggestions([]);
      return;
    }
    setDestination(city);
    setDestinationSuggestions([]);
    setDestinationError("");
  };

  const fetchDrivers = async (uniqueDriverIds) => {
    const newDrivers = {};

    await Promise.all(
      uniqueDriverIds.map(async (driverId) => {
        try {
          const res = await fetch(`http://localhost:5090/user/${driverId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${user.token}`,
            }
          });
          const data = await res.json();
          newDrivers[driverId] = data;
        } catch (err) {
          console.error(`Error fetching driver with ID ${driverId}:`, err);
          newDrivers[driverId] = { nom: "Inconnu", prenom: "", rating: 0 };
        }
      })
    );

    setDriversInfo((prev) => ({ ...prev, ...newDrivers }));
  };

  const fetchBookedTrips = async () => {
    if (!user || user.role === "driver") {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5090/passenger-trips/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch booked trips');
      }
      const data = await response.json();
      const bookedIds = new Set(data.map(trip => trip.id_trajet));
      setBookedTripIds(bookedIds);
    } catch (error) {
      console.error('Error fetching booked trips:', error);
      toast.error('Failed to load your booked trips.');
    }
  };

  useEffect(() => {
    fetchBookedTrips();
  }, [user]);

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
        setBookedTripIds(prev => new Set([...prev, id_trajet]));
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error booking trip:', error);
      toast.error('An error occurred while booking the trip.');
    }
  };

  const handleSearch = async () => {
    setHasSearched(true);
    setLoading(true);

    if (!departure.trim()) {
      setDepartureError("Please enter a departure city.");
      setLoading(false);
      return;
    }
    if (!destination.trim()) {
      setDestinationError("Please enter a destination city.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5090/search?ville_depart=${departure}&ville_arriver=${destination}&date_depart=${selectedDate}&nbr_places=${passengers}`
      );
      const data = await res.json();
      setSearchResults(data);

      const uniqueDriverIds = [...new Set(data.map((trip) => trip.id_driver))];
      fetchDrivers(uniqueDriverIds);

      setLoading(false);
    } catch (err) {
      console.error("Search error:", err);
      setLoading(false);
    }
  };

  // Helper function to format the date as d/m/yy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A"; // Handle invalid date
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based
    const year = date.getFullYear().toString().slice(-2); // Last two digits of year
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="w-full bg-white rounded-lg p-6 shadow-lg font-myFont2">
      <div className="grid grid-cols-4 gap-4">
        {/* Departure */}
        <div className="relative">
          <input
            type="text"
            placeholder="Departure City"
            value={departure}
            onChange={handleDepartureChange}
            className={`w-full p-3 border rounded pl-10 text-black ${departureError ? 'border-red-500' : ''}`}
          />
          <MapPin className="absolute left-3 top-4 text-gray-400" />
          {departureError && <p className="text-red-500 text-sm mt-1">{departureError}</p>}
          {departureSuggestions.length > 0 && (
            <ul className="absolute left-0 w-full bg-white border rounded shadow-lg z-10">
              {departureSuggestions.map((city, idx) => (
                <li
                  key={idx}
                  onClick={() => handleDepartureSelection(city)}
                  className="p-2 text-black hover:bg-gray-100 cursor-pointer"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Destination */}
        <div className="relative">
          <input
            type="text"
            placeholder="Destination City"
            value={destination}
            onChange={handleDestinationChange}
            className={`w-full p-3 border rounded pl-10 text-black ${destinationError ? 'border-red-500' : ''}`}
            disabled={!departure.trim()}
          />
          <MapPin className="absolute left-3 top-4 text-gray-400" />
          {destinationError && <p className="text-red-500 text-sm mt-1">{destinationError}</p>}
          {destinationSuggestions.length > 0 && (
            <ul className="absolute left-0 w-full bg-white border rounded shadow-lg z-10">
              {destinationSuggestions.map((city, idx) => (
                <li
                  key={idx}
                  onClick={() => handleDestinationSelection(city)}
                  className="p-2 text-black hover:bg-gray-100 cursor-pointer"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Date */}
        <div className="relative">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 border rounded pl-10 text-black"
          />
          <Calendar className="absolute left-3 top-4 text-gray-400" />
        </div>

        {/* Passengers */}
        <div className="relative">
          <select
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="w-full p-3 border rounded pl-10 text-black"
          >
            {[...Array(5)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} passenger{i > 0 ? "s" : ""}
              </option>
            ))}
          </select>
          <Users className="absolute left-3 top-4 text-gray-400" />
        </div>
      </div>

      <button
        className="w-full mt-4 bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
        onClick={handleSearch}
      >
        Search for a trip
      </button>

      {/* Results */}
      <div className="mt-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading trips...</p>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 mt-4">
            {searchResults.map((trip, index) => {
              const driver = driversInfo[trip.id_driver];
              const isBooked = bookedTripIds.has(trip.id_trajet);

              return (
                <div key={index} className="bg-gray-100 flex justify-between items-center p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold text-black">{trip.ville_depart}</span>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                      <MapPin className="h-5 w-5 text-green-500" />
                      <span className="font-semibold text-black">{trip.ville_arriver}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-black">
                        {formatDate(trip.date_depart)} at {trip.heure_depart ? trip.heure_depart.slice(0, 5) : "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-black font-semibold">Driver:</span>
                      <span className="text-black">
                        {driver ? `${driver.nom} ${driver.prenom}` : "Loading..."}
                      </span>
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-black">{driver ? driver.rating : "Loading..."}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-black">{trip.nbr_places} seats</span>
                      <Music className="h-4 w-4 text-red-500" />
                      <Cigarette className="h-4 w-4 text-red-500" />
                      <Dog className="h-4 w-4 text-red-500" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-green-600 font-semibold">
                      <DollarSign className="h-5 w-5" />
                      <span>{trip.prix}</span>
                    </div>
                    <button
                      onClick={() => !isBooked && bookTrip(trip.id_trajet, user.id)}
                      disabled={isBooked}
                      className={`py-2 px-4 rounded ${isBooked ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      {isBooked ? 'Booked' : 'Book Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No trips found.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SearchTrip;