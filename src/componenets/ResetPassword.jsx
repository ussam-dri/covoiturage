import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://backend-codrive.zelobrix.com/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword })
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full p-2 border rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">Update Password</button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}