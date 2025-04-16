import React from 'react';
import { MapPin } from 'lucide-react'; // Import the MapPin icon

const TripTimeline = ({ origin, destination }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Paris */}
      <div className="flex items-center space-x-2">
        <div className="bg-white rounded-full p-1 shadow">
          <MapPin className="w-6 h-6 text-blue-500" />
        </div>
        <div className="text-lg font-medium">{origin}</div>
      </div>

      {/* Vertical Line */}
      <div className="w-px h-20 bg-gray-300"></div>

      {/* Lyon */}
      <div className="flex items-center space-x-2">
        <div className="bg-white rounded-full p-1 shadow">
          <MapPin className="w-6 h-6 text-blue-500" />
        </div>
        <div className="text-lg font-medium">{destination}</div>
      </div>
    </div>
  );
};

export default TripTimeline;