import { useState } from 'react';
import RecordForm from './AddRecord';
import RecordList from './RecordList';

function RecordPage() {
  const [reloadTrigger, setReloadTrigger] = useState(false);

  const fetchRecords = () => {
    setReloadTrigger(prev => !prev); // toggle to trigger refresh
  };

  return (
    <div className="p-6">
      <RecordForm fetchRecords={fetchRecords} />
      <div className="mt-8">
        <RecordList reloadTrigger={reloadTrigger} />
      </div>
    </div>
  );
}

export default RecordPage;
