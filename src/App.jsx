import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; // TailwindCSS

function App() {
  const [userType, setUserType] = useState('general');
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    email: '',
    dob: '',
    profession: '',
    fatherName: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [dynamicFields, setDynamicFields] = useState({});

  // Handle user type change and reset dynamic fields
  useEffect(() => {
    if (userType === 'general') {
      setDynamicFields({
        govIdType: '',
        govIdNumber: '',
      });
    } else if (userType === 'indian') {
      setDynamicFields({
        aadhaar: '',
        university: '',
      });
    } else if (userType === 'foreign') {
      setDynamicFields({
        passport: '',
        institution: '',
        country: '',
      });
    }
  }, [userType]);

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in dynamicFields) {
      setDynamicFields((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const dataToSend = {
      ...formData,
      ...dynamicFields,
      userType,
    };

    try {
      const response = await axios.post('http://localhost:3000/register', dataToSend);

      if (response.status === 201) {
        alert('Registration successful!');
        setFormData({
          firstName: '',
          middleName: '',
          lastName: '',
          phone: '',
          email: '',
          dob: '',
          profession: '',
          fatherName: '',
          address: '',
          password: '',
          confirmPassword: '',
        });
        setDynamicFields({});
      } else {
        alert('Something went wrong!');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert(`Server error: ${error.response.data.message}`);
      } else {
        alert('Network error or server not responding');
      }
      console.error(error);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Odisha State Archives - Registration</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="userType" value={userType} onChange={handleUserTypeChange} className="w-full p-2 border rounded">
          <option value="general">General Public</option>
          <option value="indian">Indian Research Scholar</option>
          <option value="foreign">Foreign Research Scholar</option>
        </select>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="p-2 border rounded" required />
          <input type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} className="p-2 border rounded" />
          <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="p-2 border rounded" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="tel" name="phone" placeholder="Mobile No" value={formData.phone} onChange={handleChange} className="p-2 border rounded" required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-2 border rounded" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="p-2 border rounded" required />
          <input type="text" name="profession" placeholder="Profession" value={formData.profession} onChange={handleChange} className="p-2 border rounded" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="fatherName" placeholder="Father/Husband Name" value={formData.fatherName} onChange={handleChange} className="p-2 border rounded" />
          <input type="text" name="address" placeholder="Present Address" value={formData.address} onChange={handleChange} className="p-2 border rounded" required />
        </div>

        {/* Dynamic Fields */}
        {Object.entries(dynamicFields).map(([key, value]) => (
          <input key={key} name={key} placeholder={key} value={value} onChange={handleChange} className="w-full p-2 border rounded" required />
        ))}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="p-2 border rounded" required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="p-2 border rounded" required />
        </div>

        <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 mt-4">
          Register
        </button>
      </form>
    </div>
  );
}

export default App;
