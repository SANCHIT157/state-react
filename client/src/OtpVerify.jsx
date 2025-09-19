import { useState } from 'react';
import axios from 'axios';

function OtpVerify() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:3000/verify-otp', {
        email,
        otp,
      });

      setMessage(res.data.message);
      setEmail('');
      setOtp('');

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-800">Verify OTP</h2>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">OTP <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="p-2 border rounded w-full"
              required
              maxLength="6"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
          >
            Verify OTP
          </button>
        </form>

        {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default OtpVerify;
