import { useForm } from 'react-hook-form';
import axios from 'axios';

function AddRecord({ fetchRecords }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:3000/api/records', {
        accession_no: data.accessionNo,
        extension_name: data.extensionName,
        subject: data.subject,
        year: parseInt(data.year),
      });

      alert('✅ Record added successfully');
      reset();
      fetchRecords();
    } catch (error) {
      alert('Error adding record: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Add Record</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4">
        <div className="flex-1">
          <input
            type="number"
            placeholder="Accession No"
            {...register('accessionNo', { required: 'Accession No is required' })}
            className="border p-2 w-full"
          />
          {errors.accessionNo && <p className="text-red-500 text-sm">{errors.accessionNo.message}</p>}
        </div>

        <div className="flex-1">
          <input
            type="text"
            placeholder="Extension Name"
            {...register('extensionName', { required: 'Extension Name is required' })}
            className="border p-2 w-full"
          />
          {errors.extensionName && <p className="text-red-500 text-sm">{errors.extensionName.message}</p>}
        </div>

        <div className="flex-1">
          <input
            type="text"
            placeholder="Subject"
            {...register('subject', { required: 'Subject is required' })}
            className="border p-2 w-full"
          />
          {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
        </div>

        <div className="flex-1">
          <input
            type="number"
            placeholder="Year"
            {...register('year', {
              required: 'Year is required',
              valueAsNumber: true,
              min: { value: 1000, message: 'Enter a valid year' },
              max: { value: 9999, message: 'Enter a valid year' },
            })}
            className="border p-2 w-full"
          />
          {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
        </div>

        <div className="w-full">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRecord;
