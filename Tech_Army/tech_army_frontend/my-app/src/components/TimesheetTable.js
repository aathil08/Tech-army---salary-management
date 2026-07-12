import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TimesheetTable.css';

const TimesheetTable = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); // Assuming you store the user ID in localStorage
        const response = await axios.get(`http://127.0.0.1:8000/api/timesheet/?user=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Reverse the timesheets array to show in LIFO order
        setTimesheets(response.data.reverse());
      } catch (error) {
        setError('Error fetching timesheets');
        console.error('Error fetching timesheets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimesheets();
  }, []);

  // Filter timesheets based on the search term
  const filteredTimesheets = timesheets.filter(timesheet =>
    timesheet.employee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTimesheets = filteredTimesheets.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredTimesheets.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  const getApprovalClass = (status) => {
    if (status === 'Approved') return 'approved';
    if (status === 'Rejected') return 'rejected';
    return 'pending';
  };

  return (
    <div className="table-container1">
      <h2>Timesheet Details</h2>
      <div className="search-bar1">
        <input
          type="text"
          placeholder="Search by Employee ID"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Project Name</th>
            <th>Module Name</th>
            <th>Week</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Total Hours</th>
            <th>Lead Approval</th>
            <th>Manager Approval</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {currentTimesheets.map((timesheet) => (
            <tr key={timesheet.id}>
              <td>{timesheet.employee}</td>
              <td>{timesheet.project_name}</td>
              <td>{timesheet.module_name}</td>
              <td>{timesheet.week}</td>
              <td>{timesheet.mon}</td>
              <td>{timesheet.tue}</td>
              <td>{timesheet.wed}</td>
              <td>{timesheet.thu}</td>
              <td>{timesheet.fri}</td>
              <td>{timesheet.total}</td>
              <td className={getApprovalClass(timesheet.lead_approval)}>
                {timesheet.lead_approval}
              </td>
              <td className={getApprovalClass(timesheet.manager_approval)}>
                {timesheet.manager_approval}
              </td>
              <td>{timesheet.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {Math.ceil(filteredTimesheets.length / itemsPerPage)}</span>
        <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredTimesheets.length / itemsPerPage)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TimesheetTable;
