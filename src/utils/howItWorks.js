import React from 'react';
import { ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: "Create Profile",
      description: "Sign up and complete your profile with driving preferences",
      icon: "images/circle_profile.png",
      alt: "User profile creation illustration"
    },
    {
      title: "Post/Find Ride",
      description: "Publish your journey or search for available rides",
      icon: "/images/image.png",
      alt: "Car with route map illustration"
    },
    {
      title: "Connect",
      description: "Chat and confirm booking details with your match",
      icon: "images/image copy.png",
      alt: "People connecting and chatting illustration"
    },
    {
      title: "Travel",
      description: "Meet up and enjoy your shared journey together",
      icon: "images/image copy 2.png",
      alt: "People traveling together in a car illustration"
    }
  ];

  return (
    <section className="py-12 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          How Carpooling Works
        </h2>

        <div className="flex flex-nowrap overflow-x-auto md:overflow-x-visible md:flex-row items-center justify-center gap-4 pb-4">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex-shrink-0 w-48 bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center">
                    <img 
                      src={step.icon} 
                      alt={step.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-shrink-0 hidden md:flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-blue-500" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors text-lg">
            Start Carpooling
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;