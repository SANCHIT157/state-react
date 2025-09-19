import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Login from './login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Dashboard from './Dashboard';
import OtpVerify from './OtpVerify';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<App />} />
        <Route path="/verify" element={<OtpVerify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
