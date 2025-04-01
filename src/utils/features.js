import React from "react";
import { DollarSign, FileText, Zap } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-4 text-teal-700">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="16" height="14" rx="2" ry="2" />
                <path d="M16 3H6a2 2 0 0 0-2 2v2" />
                <circle cx="14" cy="14" r="2" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-teal-800 mb-2">Your pick of rides at low prices</h3>
            <p className="text-gray-500">
              No matter where you're going, by bus or carpool, find the perfect ride from our wide range of destinations and routes at low prices.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-4 text-teal-700">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-teal-800 mb-2">Trust who you travel with</h3>
            <p className="text-gray-500">
              We take the time to get to know each of our members and bus partners. We check reviews, profiles and IDs, so you know who you're travelling with and can book your ride at ease on our secure platform.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-4 text-teal-700">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-teal-800 mb-2">Scroll, click, tap and go!</h3>
            <p className="text-gray-500">
              Booking a ride has never been easier! Thanks to our simple app powered by great technology, you can book a ride close to you in just minutes.
            </p>
          </div>
        </div>
      </div>
      
      {/* Blue bar at bottom */}
      <div className="h-2 bg-blue-500 w-full mt-16"></div>
    </section>
  );
};

export default FeaturesSection;