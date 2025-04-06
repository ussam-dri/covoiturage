import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import Footer from "./utils/Footer";
import FeaturesSection from "./utils/features";
import StatisticsCounter from "./utils/rides_counter";
import { Header } from "./utils/Header";
import useLogout from './utils/logout';
import SearchTrip from "./utils/searchTrip";
import HowItWorks from "./utils/howItWorks";
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
      const response = await fetch(`http://localhost:5090/autocomplete?query=${query}`);
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
      setDestinationError("Please enter a departure city");
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (!departure.trim()) {
      setDepartureError("Please enter a destination city");
      return;
    }
    
    if (!destination.trim()) {
      setDestinationError("Destination cannot be the same as the departure");
      return;
    }
    //
    // If all validations pass, proceed with search
    console.log("Searching for rides:", { departure, destination, date: selectedDate, passengers });
    // Implement search functionality here
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
    <Header ></Header>

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
          You’ve got plans, we’ve got the perfect ride.          </h1>

          {/* Search Box */}
       <SearchTrip></SearchTrip>
          
        </div>
        
      </div>
      <StatisticsCounter></StatisticsCounter>

      <FeaturesSection></FeaturesSection>
    <HowItWorks></HowItWorks>
      <Footer></Footer>
    </div>
  );
};

export default Homepage;