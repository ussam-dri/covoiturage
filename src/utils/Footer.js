import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Copyright */}
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-400">codrive</span>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              &copy; {currentYear} codrive. All rights reserved.
            </p>
          </div>
          
          {/* Links */}
          <div className="grid grid-cols-2 gap-8 md:gap-16 mb-6 md:mb-0">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          {/* Social Media */}
          <div className="mt-6 md:mt-0">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-center md:text-right">Connect With Us</h3>
            <div className="flex space-x-4 justify-center md:justify-end">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <img 
                  src="https://img.icons8.com/ios/30/FFFFFF/facebook--v1.png" 
                  alt="Facebook" 
                  className="w-6 h-6 opacity-70 hover:opacity-100"
                />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <img 
                  src="https://img.icons8.com/ios/30/FFFFFF/instagram-new--v1.png" 
                  alt="Instagram" 
                  className="w-6 h-6 opacity-70 hover:opacity-100"
                />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <img 
                  src="https://img.icons8.com/ios/30/FFFFFF/twitter--v1.png" 
                  alt="Twitter" 
                  className="w-6 h-6 opacity-70 hover:opacity-100"
                />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <img 
                  src="https://img.icons8.com/ios/30/FFFFFF/linkedin--v1.png" 
                  alt="LinkedIn" 
                  className="w-6 h-6 opacity-70 hover:opacity-100"
                />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">YouTube</span>
                <img 
                  src="https://img.icons8.com/ios/30/FFFFFF/youtube-play--v1.png" 
                  alt="YouTube" 
                  className="w-6 h-6 opacity-70 hover:opacity-100"
                />
              </a>
            </div>
          </div>
        </div>
        
     
      </div>
    </footer>
  );
};

export default Footer;