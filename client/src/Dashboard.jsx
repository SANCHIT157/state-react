import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecordList from './records/RecordList';
import AddRecord from './records/AddRecord';
import UploadCSV from './records/UploadCSV';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchRecords = async () => {
    const res = await axios.get('http://localhost:3000/api/records?page=1&limit=10');
    setRecords(res.data.records);
  };
  

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-blue-800 text-white flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center">
          <img src="/odisha_logo.png" alt="Odisha Logo" className="h-14 w-14 mr-4" />
          <h1 className="text-2xl font-bold">Odisha State Archives</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="font-semibold text-sm">Shri Mohan Charan Majhi</p>
            <p className="text-xs">Hon'ble Chief Minister</p>
          </div>
          <img src="/mohan-majhi.jpg" alt="CM Mohan Majhi" className="h-14 w-14 border-2 border-white shadow" />
        </div>
      </header>

      {/* User Info */}
      <main className="px-4 py-6">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto mb-8 text-gray-800">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {user.profilePhotoPath ? (
              <img
                src={`http://localhost:3000/${user.profilePhotoPath}`}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                No Photo
              </div>
            )}

            <div className="flex-1">
              <h2 className="text-xl font-bold">Welcome, {user.firstName} {user.lastName}</h2>
              <ul className="space-y-1 mt-2 text-sm md:text-base">
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>User Type:</strong> {user.userType || 'General'}</li>
                <li><strong>Phone:</strong> {user.phone || 'N/A'}</li>
                <li><strong>Profession:</strong> {user.profession || 'N/A'}</li>
                <li><strong>DOB:</strong> {user.dob || 'N/A'}</li>
                <li><strong>Address:</strong> {user.address || 'N/A'}</li>
              </ul>
            </div>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4 md:mt-0"
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* RECORD MANAGEMENT SECTION */}
        <div className="max-w-6xl mx-auto space-y-6">
        <AddRecord fetchRecords={fetchRecords} />
          <UploadCSV/>
          <RecordList />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
