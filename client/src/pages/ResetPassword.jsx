import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:3000/reset-password/${token}`, { password });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-blue-800 text-white flex justify-between items-center p-4">
        <div className="flex items-center">
          <img src="/odisha_logo.png" alt="Odisha Logo" className="h-14 w-14 mr-4" />
          <h1 className="text-2xl font-bold">Odisha State Archives</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold text-sm">Shri Mohan Charan Majhi</p>
            <p className="text-xs">Hon'ble Chief Minister</p>
          </div>
          <img src="/mohan-majhi.jpg" alt="CM Mohan Majhi" className="h-14 w-14 border-2 border-white shadow" />
        </div>
      </header>

      {/* Body */}
      <main className="flex justify-center px-4 mt-16">
        <div className="bg-white shadow-md rounded-md p-8 w-full max-w-md">
          <h2 className="text-xl font-bold mb-6 text-center text-gray-700">Reset Your Password</h2>
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 border rounded mb-4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            onClick={handleReset}
            className="w-full py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            Reset Password
          </button>
          {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
        </div>
      </main>
    </div>
  );
}

export default ResetPassword;
