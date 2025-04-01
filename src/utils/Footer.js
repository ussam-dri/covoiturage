import React from "react";
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Top carpool routes */}
          <div>
            <h3 className="text-lg font-medium text-teal-800 mb-4">Top carpool routes</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-teal-700 hover:text-teal-500">Delhi → Chandigarh</a></li>
              <li><a href="#" className="text-teal-700 hover:text-teal-500">Mumbai → Pune</a></li>
              <li><a href="#" className="text-teal-700 hover:text-teal-500">Kanpur → Lucknow</a></li>
              <li><a href="#" className="text-teal-700 hover:text-teal-500">Bengaluru → Chennai</a></li>
              <li><a href="#" className="text-teal-700 hover:text-teal-500">Pune → Mumbai</a></li>
              <li><a href="#" className="text-teal-700 hover:text-teal-500 font-medium">All carpool routes</a></li>
              <li><a href="#" className="text-teal-700 hover:text-teal-500 font-medium">All carpool destinations</a></li>
            </ul>
          </div>

          {/* Middle Column - About */}
          <div>
            <h3 className="text-lg font-medium text-teal-800 mb-4">About</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-teal-700 hover:text-teal-500">How It Works</a></li>
              <li><a href="#" className="text-teal-700 hover:text-teal-500">About Us</a></li>
              <li><a href="#" className="text-teal-700 hover:text-teal-500">Help Centre</a></li>
              <li><a href="#" className="text-teal-700 hover:text-teal-500">Press</a></li>
              <li><a href="#" className="text-teal-700 hover:text-teal-500">We're Hiring!</a></li>
            </ul>
          </div>

          {/* Right Column - Language and Social */}
          <div className="flex flex-col items-end">
            <div className="mb-6">
              <button className="bg-white text-blue-500 px-4 py-2 rounded-full shadow-sm border border-gray-200">
                Language - Français
              </button>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-blue-500 hover:text-blue-600">
                <Facebook size={32} />
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-500">
                <Twitter size={32} />
              </a>
              <a href="#" className="text-red-600 hover:text-red-700">
                <Youtube size={32} />
              </a>
              <a href="#" className="text-pink-600 hover:text-pink-700">
                <Instagram size={32} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row with Terms and Copyright */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div>
            <a href="#" className="text-gray-500 hover:text-gray-700">Terms and Conditions</a>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <div className="flex mr-2">
              <span className="h-6 w-6 bg-teal-400 rounded-full mr-1"></span>
              <span className="h-6 w-6 bg-teal-700 rounded-full"></span>
            </div>
            <span className="text-gray-600">Covoiturage, 2025 ©</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;