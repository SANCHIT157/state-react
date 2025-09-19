import { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:3000/forgot-password', { email });

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
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
          <h2 className="text-xl font-bold mb-6 text-center text-gray-700">Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            Send Reset Link
          </button>
          {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;
