import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header } from '../utils/Header';
import Footer from '../utils/Footer';
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
// ----------------------this page is used for admin to edit any user profile -------- usign /id in the url
export default function EditProfiles() {
    const userId= useParams().id;
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    num_telephone: '',
    cin: '',
    date_naissance: '',
    sexe: '',
    ville: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false); // for safe rendering

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5090/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user');

        const data = await response.json();

        setFormData({
          nom: data.nom || '',
          prenom: data.prenom || '',
          email: data.email || '',
          num_telephone: data.num_telephone || '',
          cin: data.cin || '',
          date_naissance: data.date_naissance?.split('T')[0] || '',
          sexe: data.sexe || '',
          ville: data.ville || ''
        });

        setIsUserLoaded(true);
      } catch (error) {
        console.error(error);
        toast.error('Error loading data');
      }
    };

    if (user?.id && user?.token) {
      fetchUserData();
    }
  }, [user?.id, user?.token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = 'Last name is required';
    if (!formData.prenom.trim()) newErrors.prenom = 'First name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.num_telephone.trim()) newErrors.num_telephone = 'Phone number is required';
    if (!formData.cin.trim()) newErrors.cin = 'ID card is required';
    if (!formData.date_naissance) newErrors.date_naissance = 'Birthdate is required';
    if (!formData.sexe) newErrors.sexe = 'Gender is required';
    if (!formData.ville.trim()) newErrors.ville = 'City is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5090/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ id: user?.id, ...formData }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user');
      }

      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // If user not loaded yet, don't render form
  if (!user || !isUserLoaded) {
    return (
      <>
        <Header />
        <div className="flex justify-center p-6">
          <p>Loading profile...</p>
        </div>
        <Footer />
        <ToastContainer position="bottom-right" />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="flex justify-center p-6">
        <form className="w-full max-w-xl" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4">Edit your profile</h2>

          {[ 
            { label: 'Last Name', name: 'nom' },
            { label: 'First Name', name: 'prenom' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Phone Number', name: 'num_telephone' },
            { label: 'ID Card', name: 'cin' },
            { label: 'Date of Birth', name: 'date_naissance', type: 'date' },
            { label: 'Gender', name: 'sexe' },
            { label: 'City', name: 'ville' },
          ].map(({ label, name, type = 'text' }) => (
            <div className="mb-4" key={name}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className={`w-full border px-3 py-2 rounded-md ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors[name] && <p className="text-sm text-red-600">{errors[name]}</p>}
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 ${isLoading && 'opacity-50 cursor-not-allowed'}`}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
      <ToastContainer position="top-right" />
    </>
  );
}
