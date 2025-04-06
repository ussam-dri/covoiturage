// src/utils/SearchTrip.js
import React, { useState } from "react";
import { Calendar, MapPin, Users } from "lucide-react";

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
  const [hasSearched, setHasSearched] = useState(false);

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

  const handleSearch = async () => {
    setHasSearched(true);

    if (!departure.trim()) {
      setDepartureError("Please enter a departure city.");
      return;
    }
    if (!destination.trim()) {
      setDestinationError("Please enter a destination city.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5090/search?ville_depart=${departure}&ville_arriver=${destination}&date_depart=${selectedDate}&nbr_places=${passengers}`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <>
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
                  <li key={idx} onClick={() => handleDepartureSelection(city)} className="p-2 text-black hover:bg-gray-100 cursor-pointer">
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
                  <li key={idx} onClick={() => handleDestinationSelection(city)} className="p-2 text-black hover:bg-gray-100 cursor-pointer">
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
      </div>

      {/* Results */}
      <div className="mt-6">
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 mt-4">
            {searchResults.map((trip, index) => (
              <div key={index} className="p-4 text-black bg-gray-100 rounded shadow">
                <p><strong>From:</strong> {trip.ville_depart}</p>
                <p><strong>To:</strong> {trip.ville_arriver}</p>
                <p><strong>Date:</strong> {trip.date_depart}</p>
                <p><strong>Available Seats:</strong> {trip.nbr_places}</p>
              </div>
            ))}
          </div>
        ) : (
          hasSearched && (
            <div className="mt-4 p-4 bg-white text-red-600 font-semibold text-center rounded shadow">
              No trips found for the selected criteria.
            </div>
          )
        )}
      </div>
    </>
  );
};

export default SearchTrip;
