
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './index.css';

function App() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [userType, setUserType] = useState('general');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [otp, setOtp] = useState('');
  const [otpExpires, setOtpExpires] = useState('');
  const [formData, setFormData] = useState(null);
  const [showOtpField, setShowOtpField] = useState(false);
  const [serverOtp, setServerOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handlePhotoUpload = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const sendOtp = async (data) => {
    if (!data.email || !data.firstName) {
      alert('Email and First Name are required to send OTP');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/send-otp', {
        email: data.email,
        firstName: data.firstName,
      });

      if (res.status === 200) {
        setFormData(data);
        setServerOtp(res.data.otp);
        setOtpExpires(res.data.otpExpires);
        setShowOtpField(true);
        setOtpSent(true);
        alert('OTP sent to your email');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const verifyOtpAndRegister = async () => {
    if (otp.trim() !== serverOtp.trim()) {
      alert('Invalid OTP');
      return;
    }

    if (!profilePhoto) {
      alert('Profile photo is required');
      return;
    }

    const finalData = new FormData();
    Object.entries({ ...formData, userType }).forEach(([key, value]) => {
      finalData.append(key, value);
    });

    finalData.append('otp', otp);
    finalData.append('otpExpires', otpExpires);
    finalData.append('profilePhoto', profilePhoto);

    try {
      const response = await axios.post('http://localhost:3000/register', finalData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        alert('Registration successful!');
        window.location.href = '/login';
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-800 text-white flex justify-between items-center p-4">
        <div className="flex items-center">
          <img src="/odisha_logo.png" className="h-14 w-14 mr-4" alt="logo" />
          <h1 className="text-2xl font-bold">Odisha State Archives</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold text-sm">Shri Mohan Charan Majhi</p>
            <p className="text-xs">Hon'ble Chief Minister</p>
          </div>
          <img src="/mohan-majhi.jpg" className="h-14 w-14 border-2 border-white shadow" alt="CM" />
        </div>
      </header>

      <main className="flex justify-center px-6 mt-10">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl grid grid-cols-1 md:grid-cols-[1fr_2fr] overflow-hidden">
          {/* LEFT: Profile Photo + OAuth */}
          <div className="bg-blue-600 text-white flex flex-col items-center justify-center p-8">
            <div className="mb-4 text-center">
              <div className="w-32 h-32 bg-white text-black rounded-full flex items-center justify-center text-sm font-semibold mb-4 overflow-hidden">
                {profilePhoto ? (
                  <img src={URL.createObjectURL(profilePhoto)} className="rounded-full w-full h-full object-cover" alt="preview" />
                ) : 'No Photo'}
              </div>
              <label className="underline cursor-pointer">
                Upload Profile Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              {!profilePhoto && <p className="text-red-500 text-sm mt-2">Profile photo is required</p>}
            </div>

            <div className="space-y-4 w-full">
              <button className="w-full bg-white text-black py-2 rounded hover:bg-gray-200 flex justify-center items-center gap-2">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/google.svg" className="h-4 w-4" alt="google" />
                Sign up with Google
              </button>
              <button className="w-full bg-white text-black py-2 rounded hover:bg-gray-200 flex justify-center items-center gap-2">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg" className="h-4 w-4" alt="fb" />
                Sign up with Facebook
              </button>
            </div>

            <p className="text-sm mt-6 text-center">
              By signing up, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
            </p>
          </div>

           {/* RIGHT: Registration Form */}
           <div className="p-8">
            <h2 className="text-xl font-bold mb-6 text-center text-gray-700">Create Account</h2>
            <form onSubmit={handleSubmit(sendOtp)} className="space-y-4" encType="multipart/form-data">
              {/* User Type */}
              <div>
                <label>User Type <span className="text-red-500">*</span></label>
                <select {...register('userType')} value={userType} onChange={(e) => setUserType(e.target.value)} className="p-2 border rounded w-full">
                  <option value="general">General Public</option>
                  <option value="indian">Indian Research Scholar</option>
                  <option value="foreign">Foreign Research Scholar</option>
                </select>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>First Name <span className="text-red-500">*</span></label>
                  <input {...register('firstName', { required: 'First name is required' })} className="p-2 border rounded w-full" />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label>Middle Name</label>
                  <input {...register('middleName')} className="p-2 border rounded w-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Last Name <span className="text-red-500">*</span></label>
                  <input {...register('lastName', { required: 'Last name is required' })} className="p-2 border rounded w-full" />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                </div>
                <div>
                  <label>Father/Husband Name</label>
                  <input {...register('fatherName')} className="p-2 border rounded w-full" />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Email <span className="text-red-500">*</span></label>
                  <input {...register('email', { required: 'Email is required' })} className="p-2 border rounded w-full" />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div>
                  <label>Phone <span className="text-red-500">*</span></label>
                  <input {...register('phone', { required: 'Phone is required' })} className="p-2 border rounded w-full" />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>
              </div>

              {/* DOB + Profession */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Date of Birth <span className="text-red-500">*</span></label>
                  <input type="date" {...register('dob', { required: 'DOB is required' })} className="p-2 border rounded w-full" />
                  {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
                </div>
                <div>
                  <label>Profession <span className="text-red-500">*</span></label>
                  <input {...register('profession', { required: 'Profession is required' })} className="p-2 border rounded w-full" />
                  {errors.profession && <p className="text-red-500 text-sm">{errors.profession.message}</p>}
                </div>
              </div>

              {/* Address */}
              <div>
                <label>Address <span className="text-red-500">*</span></label>
                <input {...register('address', { required: 'Address is required' })} className="p-2 border rounded w-full" />
                {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
              </div>

              {/* Dynamic Fields */}
              {userType === 'general' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Govt ID Type <span className="text-red-500">*</span></label>
                    <select {...register('govIdType', { required: 'Govt ID Type is required' })} className="p-2 border rounded w-full">
                      <option value="">Select</option>
                      <option value="pan">PAN Card</option>
                      <option value="aadhaar">Aadhaar Card</option>
                      <option value="voter">Voter ID Card</option>
                    </select>
                    {errors.govIdType && <p className="text-red-500 text-sm">{errors.govIdType.message}</p>}
                  </div>
                  <div>
                    <label>Govt ID Number <span className="text-red-500">*</span></label>
                    <input {...register('govIdNumber', { required: 'Govt ID Number is required' })} className="p-2 border rounded w-full" />
                    {errors.govIdNumber && <p className="text-red-500 text-sm">{errors.govIdNumber.message}</p>}
                  </div>
                </div>
              )}

              {userType === 'indian' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Aadhaar <span className="text-red-500">*</span></label>
                    <input {...register('aadhaar', { required: 'Aadhaar is required' })} className="p-2 border rounded w-full" />
                    {errors.aadhaar && <p className="text-red-500 text-sm">{errors.aadhaar.message}</p>}
                  </div>
                  <div>
                    <label>University <span className="text-red-500">*</span></label>
                    <input {...register('university', { required: 'University is required' })} className="p-2 border rounded w-full" />
                    {errors.university && <p className="text-red-500 text-sm">{errors.university.message}</p>}
                  </div>
                </div>
              )}

              {userType === 'foreign' && (
                <>
                  <div>
                    <label>Passport <span className="text-red-500">*</span></label>
                    <input {...register('passport', { required: 'Passport is required' })} className="p-2 border rounded w-full" />
                    {errors.passport && <p className="text-red-500 text-sm">{errors.passport.message}</p>}
                  </div>
                  <div>
                    <label>Institution <span className="text-red-500">*</span></label>
                    <input {...register('institution', { required: 'Institution is required' })} className="p-2 border rounded w-full" />
                    {errors.institution && <p className="text-red-500 text-sm">{errors.institution.message}</p>}
                  </div>
                  <div>
                    <label>Country <span className="text-red-500">*</span></label>
                    <input {...register('country', { required: 'Country is required' })} className="p-2 border rounded w-full" />
                    {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
                  </div>
                </>
              )}

              {/* Passwords */}
              <input type="password" {...register('password', { required: true })} placeholder="Password" className="p-2 border rounded w-full" />
              <input type="password" {...register('confirmPassword', { required: true })} placeholder="Confirm Password" className="p-2 border rounded w-full" />

              <div className="flex items-center">
                <input type="checkbox" {...register('terms', { required: true })} className="mr-2" />
                <label>I agree to all Terms and Policies</label>
              </div>

              {/* OTP Input (if shown) */}
              {showOtpField && (
                <div>
                  <label>Enter OTP <span className="text-red-500">*</span></label>
                  <input value={otp} onChange={(e) => setOtp(e.target.value)} className="p-2 border rounded w-full" />
                </div>
              )}

              {/* Final Buttons */}
              {!otpSent ? (
                <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded w-full">
                  Send OTP
                </button>
              ) : (
                <button type="button" onClick={verifyOtpAndRegister} className="bg-green-700 text-white px-4 py-2 rounded w-full">
                  Verify OTP & Register
                </button>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
