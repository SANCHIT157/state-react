import { useState } from 'react';
import axios from 'axios';

function UploadCSV({ fetchRecords }) {
  const [csvFile, setCsvFile] = useState(null);

  const handleCSVUpload = async () => {
    if (!csvFile) {
      alert('Please select a CSV file to upload');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', csvFile);
  
    try {
      const res = await axios.post('http://localhost:3000/api/records/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      alert(res.data.message); // Show success message
      setCsvFile(null);        // Clear input
      if (fetchRecords) fetchRecords(); // Refresh list
    } catch (error) {
      console.error('CSV Upload Error:', error); // ✅ Now logs real error
      alert(
        error.response?.data?.message ||
        error.message ||
        'CSV upload failed'
      );
    }
  };
  
  return (
    <div className="bg-white p-6 rounded shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Upload Records via CSV</h2>
      <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} className="mb-4" />
      <button onClick={handleCSVUpload} className="bg-green-500 text-white px-4 py-2 rounded">Upload</button>
    </div>
  );
}

export default UploadCSV;
