import { useEffect, useState } from 'react';
import axios from 'axios';

function RecordList({ reloadTrigger }) 
  {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/records?page=${page}&limit=5`);
      setRecords(res.data.records || []);
      setTotalPages(res.data.totalPages || Math.ceil(res.data.total / 5) || 1);
    } catch (err) {
      console.error('Error fetching records:', err);
      alert('Failed to fetch records');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page, reloadTrigger]); // 👈 trigger refetch when `reloadTrigger` changes
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/records/${id}`);
      fetchRecords();
    } catch (err) {
      alert('Error deleting record');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Record List</h2>

      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Accession No</th>
            <th className="border p-2">Extension</th>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Year</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((rec) => (
              <tr key={rec._id}>
                <td className="border p-2">{rec.accession_no}</td>
                <td className="border p-2">{rec.extension_name}</td>
                <td className="border p-2">{rec.subject}</td>
                <td className="border p-2">{rec.year}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDelete(rec._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-gray-500 p-4">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center gap-4 justify-center">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default RecordList;
