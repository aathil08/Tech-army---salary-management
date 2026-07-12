import React from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const DownloadTimesheet = ({ employeeId }) => {
  const handleDownload = async () => {
    const response = await axios.get(`http://localhost:8000/download-timesheet/${employeeId}/`, {
      responseType: 'blob'
    });
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    saveAs(blob, `timesheet_${employeeId}.xlsx`);
  };

  return <button onClick={handleDownload}>Download</button>;
};

export default DownloadTimesheet;
