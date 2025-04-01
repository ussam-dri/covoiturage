import React, { useState, useEffect } from 'react';

const StatisticsCounter = () => {
  // Initial and target values for each counter
  const [counters, setCounters] = useState({
    rides: 0,
    cities: 0,
    drivers: 0
  });
  
  // Target values to count up to
  const targetValues = {
    rides: 300,
    cities: 70,
    drivers: 20
  };
  
  // Format numbers with space as thousand separator (French style)
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  useEffect(() => {
    // Duration for the animation in milliseconds
    const animationDuration = 2000;
    const steps = 50;
    const interval = animationDuration / steps;
    
    const timer = setInterval(() => {
      setCounters(prevCounters => {
        // Check if all counters have reached their targets
        const allDone = 
          prevCounters.rides >= targetValues.rides &&
          prevCounters.cities >= targetValues.cities &&
          prevCounters.drivers >= targetValues.drivers;
          
        if (allDone) {
          clearInterval(timer);
          return prevCounters;
        }
        
        // Update each counter incrementally
        return {
          rides: Math.min(prevCounters.rides + Math.ceil(targetValues.rides / steps), targetValues.rides),
          cities: Math.min(prevCounters.cities + Math.ceil(targetValues.cities / steps), targetValues.cities),
          drivers: Math.min(prevCounters.drivers + Math.ceil(targetValues.drivers / steps), targetValues.drivers)
        };
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-blue-50 py-16 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-center items-center space-y-12 md:space-y-0 md:space-x-16">
        
        {/* Image Section */}
        <div className="flex justify-center md:justify-start w-full md:w-1/3">
          <img className="w-full h-auto max-w-xs" src="/images/driver-8b8061fb1af127e7.svg" alt="Carpooling" />
        </div>
        
        {/* Counter Section */}
        <div className="flex flex-col md:flex-row justify-center items-center space-y-12 md:space-y-0 md:space-x-16 w-full md:w-2/3">
          
          {/* Trajets counter */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <span className="text-6xl font-bold text-blue-500">+{formatNumber(counters.rides)}</span>
            </div>
            <p className="text-gray-600 text-xl mt-2">Trajets effectués</p>
          </div>

          {/* Villes counter */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <span className="text-6xl font-bold text-blue-500">{formatNumber(counters.cities)}+</span>
            </div>
            <p className="text-gray-600 text-xl mt-2">Villes desservies</p>
          </div>

          {/* Conducteurs counter */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <span className="text-6xl font-bold text-blue-500">+{formatNumber(counters.drivers)}</span>
            </div>
            <p className="text-gray-600 text-xl mt-2">Conducteurs vérifiés</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StatisticsCounter;
