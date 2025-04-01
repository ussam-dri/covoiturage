import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import Footer from "./utils/Footer";
import FeaturesSection from "./utils/features";
import StatisticsCounter from "./utils/rides_counter";
import { Header } from "./utils/Header";

const Homepage = () => {

    const [count, setCount] = useState(0);
  
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count > 0 ? count - 1 : 0);

  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [destinationError, setDestinationError] = useState("");
  const [departureError, setDepartureError] = useState("");

  // Function to fetch autocomplete suggestions
  const fetchSuggestions = async (query, type) => {
    if (query.length < 2) return; // Prevent unnecessary API calls for short queries

    try {
      const response = await fetch(`http://localhost:5000/autocomplete?query=${query}`);
      const data = await response.json();
      if (type === "departure") {
        setDepartureSuggestions(data);
      } else {
        setDestinationSuggestions(data);
      }
    } catch (error) {
      console.error("Error fetching autocomplete data:", error);
    }
  };

  // Handle departure change
  const handleDepartureChange = (e) => {
    const value = e.target.value;
    setDeparture(value);
    setDepartureError("");
    
    // If destination is the same as new departure value, show error
    if (value && value === destination) {
      setDestinationError("La destination ne peut pas être identique au départ");
    } else {
      setDestinationError("");
    }
    
    fetchSuggestions(value, "departure");
  };

  // Handle destination change
  const handleDestinationChange = (e) => {
    const value = e.target.value;
    
    // Prevent entering destination if departure is empty
    if (!departure.trim()) {
      setDestinationError("Veuillez d'abord saisir une ville de départ");
      return;
    }
    
    // Check if destination matches departure
    if (value && value === departure) {
      setDestinationError("La destination ne peut pas être identique au départ");
    } else {
      setDestinationError("");
    }
    
    setDestination(value);
    fetchSuggestions(value, "destination");
  };

  // Handle destination selection from suggestions
  const handleDestinationSelection = (city) => {
    if (city === departure) {
      setDestinationError("La destination ne peut pas être identique au départ");
      setDestinationSuggestions([]);
      return;
    }
    
    setDestination(city);
    setDestinationError("");
    setDestinationSuggestions([]);
  };

  // Handle departure selection from suggestions
  const handleDepartureSelection = (city) => {
    setDeparture(city);
    setDepartureError("");
    setDepartureSuggestions([]);
    
    // If current destination equals the new departure, clear destination
    if (destination === city) {
      setDestination("");
      setDestinationError("La destination ne peut pas être identique au départ");
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (!departure.trim()) {
      setDepartureError("Veuillez saisir une ville de départ");
      return;
    }
    
    if (!destination.trim()) {
      setDestinationError("Veuillez saisir une ville de destination");
      return;
    }
    
    // If all validations pass, proceed with search
    console.log("Searching for rides:", { departure, destination, date: selectedDate, passengers });
    // Implement search functionality here
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
    <Header></Header>

      {/* Hero Section */}
      <div
        className="relative h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url("/api/placeholder/1600/900")' }}
      >
        <div className="absolute inset-0 bg-black opacity-20">
          <img className="h-full w-full" src="/images/heroo.webp" alt="Hero" />
        </div>
        <div className="z-10 text-center text-white">
          <h1 className="text-4xl text-black font-bold mb-4 font-myFont2">
            Vous avez vos plans, on a vos bons plans.
          </h1>

          {/* Search Box */}
          <div className="w-full bg-white rounded-lg p-6 shadow-lg font-myFont2">
            <div className="grid grid-cols-4 gap-4">
              {/* Departure Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Départ"
                  value={departure}
                  onChange={handleDepartureChange}
                  className={`w-full p-3 border rounded pl-10 text-black ${departureError ? 'border-red-500' : ''}`}
                />
                <MapPin className="absolute left-3 top-4 text-gray-400" />
                {departureError && (
                  <p className="text-red-500 text-sm mt-1 text-left">{departureError}</p>
                )}
                {/* Autocomplete suggestions */}
                {departureSuggestions.length > 0 && (
                  <ul className="absolute left-0 w-full text-black bg-white border rounded shadow-lg z-10">
                    {departureSuggestions.map((city, index) => (
                      <li
                        key={index}
                        onClick={() => handleDepartureSelection(city)}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Destination Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Destination"
                  value={destination}
                  onChange={handleDestinationChange}
                  className={`w-full p-3 border rounded pl-10 text-black ${destinationError ? 'border-red-500' : ''}`}
                  disabled={!departure.trim()}
                />
                <MapPin className="absolute left-3 top-4 text-gray-400" />
                {destinationError && (
                  <p className="text-red-500 text-sm mt-1 text-left">{destinationError}</p>
                )}
                {/* Autocomplete suggestions */}
                {destinationSuggestions.length > 0 && (
                  <ul className="absolute left-0 w-full text-black bg-white border rounded shadow-lg z-10">
                    {destinationSuggestions.map((city, index) => (
                      <li
                        key={index}
                        onClick={() => handleDestinationSelection(city)}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Date Input */}
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 border rounded pl-10 text-black"
                />
                <Calendar className="absolute left-3 top-4 text-gray-400" />
              </div>

              {/* Passengers Input */}
              <div className="relative">
                <select
                  className="w-full p-3 border rounded pl-10 text-black"
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                >
                  {[...Array(5)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} passager{i > 0 ? "s" : ""}
                    </option>
                  ))}
                </select>
                <Users className="absolute left-3 top-4 text-gray-400" />
              </div>
            </div>
            <button 
              className="w-full mt-4 bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition font-myFont2"
              onClick={handleSearch}
            >
              Rechercher
            </button>
          </div>
          
        </div>
        
      </div>
      <FeaturesSection></FeaturesSection>
   
    <StatisticsCounter></StatisticsCounter>
      <Footer></Footer>
    </div>
  );
};

export default Homepage;