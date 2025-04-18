import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Calendar, Clock, User, Mail, Phone, MapIcon, ThumbsUp, Navigation, Award, TrendingUp, ShieldCheck } from 'lucide-react';
import { useSelector } from "react-redux";
import Footer from '../utils/Footer';
import { Header } from '../utils/Header';

function DriverProfile() {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        setLoading(true);
        // Fetch driver info
        const resDriver = await fetch(`http://localhost:5090/user/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const driverData = await resDriver.json();
        setDriver(driverData);

        // Fetch driver reviews
        const resReviews = await fetch(`http://localhost:5090/driver/${id}/reviews`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const reviewsData = await resReviews.json();
        setReviews(reviewsData);

        // Fetch only active trips (status === 0)
        const resTrips = await fetch(`http://localhost:5090/driver-trips/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const tripsData = await resTrips.json();
        setTrips(tripsData.filter(t => t.status === 0));
      } catch (err) {
        console.error('Error loading driver profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [id, user.token]);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 'No ratings yet';
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    return avg.toFixed(1);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="text-yellow-400 fill-yellow-400" size={16} />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300" size={16} />);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <>
        <Header variant='visitor' />
        <div className="max-w-4xl mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading driver profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header variant='visitor' />
      <div className="max-w-4xl mx-auto px-4 py-10">
        {driver ? (
          <>
            <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-white text-blue-500 rounded-full p-3 mr-4">
                      <User size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">{driver.prenom} {driver.nom}</h2>
                      <p className="text-blue-100 flex items-center gap-1">
                        <ShieldCheck size={16} />
                        Verified Driver
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2">
                    <Star className="text-yellow-300 fill-yellow-300 mr-1" size={24} />
                    <span className="text-xl font-bold">{calculateAverageRating()}</span>
                    <span className="text-sm ml-1 text-blue-100">({reviews.length} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Driver Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <User className="text-blue-500 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{driver.prenom} {driver.nom}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="text-blue-500 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{driver.adresse || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="text-blue-500 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium">{driver.sexe || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Award className="text-blue-500 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">Professional Driver</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ThumbsUp className="text-blue-500 mr-2" size={20} />
                  <h3 className="text-xl font-semibold">Passenger Reviews</h3>
                </div>
                
                {reviews.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {reviews.map((review, idx) => (
                      <div key={idx} className="border-b pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-gray-700">{review.rating}/5</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{review.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Star className="mx-auto mb-2 text-gray-400" size={24} />
                    <p>No reviews yet.</p>
                  </div>
                )}
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Navigation className="text-blue-500 mr-2" size={20} />
                  <h3 className="text-xl font-semibold">Active Trips</h3>
                </div>
                
                {trips.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {trips.map((trip) => (
                      <div key={trip.id_trajet} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center text-blue-600 font-medium mb-2">
                          <MapIcon size={18} className="mr-1" />
                          <span className="mr-2">{trip.ville_depart}</span>
                          <TrendingUp size={16} className="mx-1" />
                          <span>{trip.ville_arriver}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                          <div className="flex items-center">
                            <Calendar size={16} className="text-gray-500 mr-1" />
                            <span>{new Date(trip.date_depart).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock size={16} className="text-gray-500 mr-1" />
                            <span>{trip.heure_depart}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Navigation className="mx-auto mb-2 text-gray-400" size={24} />
                    <p>No active trips.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-lg text-gray-600">Driver profile not found or could not be loaded.</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default DriverProfile;