import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../utils/Header';
import Footer from '../utils/Footer';

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5090/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword })
    });

    const data = await res.json();
    setMessage(data.message);
    if (res.ok) {
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reset Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="w-full p-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Update Password
            </button>
          </form>
          {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
}