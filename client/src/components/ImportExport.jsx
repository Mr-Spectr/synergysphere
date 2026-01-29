import React, { useRef } from 'react';
import { exportJSON, importJSON } from '../services/api';

export default function ImportExport() {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    exportJSON();
  };

  const handleImport = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await importJSON(file);
        alert('Data imported successfully! Please refresh the page.');
      } catch (error) {
        alert('Error importing data: ' + error.message);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Import/Export</h3>
      <div className="space-y-2">
        <button
          onClick={handleExport}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          aria-label="Export workspace data"
        >
          Export JSON
        </button>
        <button
          onClick={handleImport}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          aria-label="Import workspace data"
        >
          Import JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Select JSON file to import"
        />
      </div>
    </div>
  );
}
