import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DownloadTimesheet from './DownloadTimesheet';
import { Link } from 'react-router-dom';

const SalaryHistory = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSalaryHistory = async () => {
      try {
        // Get JWT token from localStorage (saved during login)
        const token = localStorage.getItem('token');

        if (!token) {
          setError('No authentication token found. Please log in.');
          return;
        }

        // Fetch salary history with token
        const res = await axios.get('http://localhost:8000/salary-updation/', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in header
          },
        });

        // Expect JSON response: { history: [...] }
        if (res.data && res.data.history) {
          setHistory(res.data.history);
        } else {
          setError('Unexpected response from server.');
        }
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 403) {
          setError('You are not authorized to view this data. Please log in again.');
        } else {
          setError('Error fetching salary history.');
        }
      }
    };

    fetchSalaryHistory();
  }, []);

  console.log('SalaryHistory component rendered');

  return (
    <div>
      <h2>Salary Updation History</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Role</th>
            <th>Previous Salary</th>
            <th>Updated Salary</th>
            <th>Date</th>
            <th>Download Timesheet</th>
            <th>Update Salary</th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map(record => (
              <tr key={record.id}>
                <td>{record.employee_name}</td>
                <td>{record.role}</td>
                <td>{record.previous_salary}</td>
                <td>{record.updated_salary}</td>
                <td>{new Date(record.updated_at).toLocaleDateString()}</td>
                <td><DownloadTimesheet employeeId={record.employee_id} /></td>
                <td><Link to={`/update-salary/${record.employee_id}`}>Update</Link></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                {error ? 'Error loading data' : 'No salary history found.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryHistory;
