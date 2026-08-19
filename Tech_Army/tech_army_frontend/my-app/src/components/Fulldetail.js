import config from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Fulldetail.css'; // Import the CSS file

const Fulldetail = ({ empId }) => {
    const [timesheets, setTimesheets] = useState([]);
    const [filteredTimesheets, setFilteredTimesheets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [timesheetsPerPage] = useState(8);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        // Fetch timesheets for the specific employee
        axios.get(`${config.API_URL}timesheet/`, {
            params: {
                user_id: empId
            }
        })
        .then(response => {
            // Log fetched data
            console.log('Fetched timesheets:', response.data);

            // Check if date field exists
            const hasDateField = response.data.every(item => item.date);
            if (hasDateField) {
                // Sort timesheets in reverse order (latest first)
                const sortedTimesheets = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setTimesheets(sortedTimesheets);
                setFilteredTimesheets(sortedTimesheets);
            } else {
                console.error('Date field is missing in timesheets');
                setTimesheets(response.data);
                setFilteredTimesheets(response.data);
            }
        })
        .catch(error => {
            console.error('Error fetching timesheets:', error);
        });
    }, [empId]);

    useEffect(() => {
        // Filter timesheets based on search input
        const filtered = timesheets.filter(timesheet => {
            const employeeMatch = timesheet.employee.toLowerCase().includes(searchInput.toLowerCase());
            const approvalMatch = timesheet.lead_approval.toLowerCase().includes(searchInput.toLowerCase()) ||
                                   timesheet.manager_approval.toLowerCase().includes(searchInput.toLowerCase());

            return employeeMatch || approvalMatch;
        });
        setFilteredTimesheets(filtered);
        setCurrentPage(1); // Reset to the first page after filtering
    }, [searchInput, timesheets]);

    // Calculate indices for slicing the filtered timesheets array
    const indexOfLastTimesheet = currentPage * timesheetsPerPage;
    const indexOfFirstTimesheet = indexOfLastTimesheet - timesheetsPerPage;
    const currentTimesheets = filteredTimesheets.slice(indexOfFirstTimesheet, indexOfLastTimesheet);

    // Calculate total pages
    const totalPages = Math.ceil(filteredTimesheets.length / timesheetsPerPage);

    // Generate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Handler functions for pagination
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageNumberClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Function to determine the text color based on approval status
    const getApprovalColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'green';
            case 'Rejected':
                return 'red';
            case 'Pending':
                return '#F6BE00';
            default:
                return 'black';
        }
    };

    return (
        <div className="fulldetail">
            <h2>Timesheets</h2>
            <input
                type="text"
                placeholder="Search by Employee ID or Approval Status"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="search-bar"
            />
            <table>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Project Name</th>
                        <th>Module Name</th>
                        <th>Week</th>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thu</th>
                        <th>Fri</th>
                        <th>Total</th>
                        <th>Leave Days</th>
                        <th>Lead Approval</th>
                        <th>Manager Approval</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTimesheets.map(timesheet => (
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
                            <td>{timesheet.leave_days}</td>
                            <td style={{ color: getApprovalColor(timesheet.lead_approval) }}>
                                {timesheet.lead_approval}
                            </td>
                            <td style={{ color: getApprovalColor(timesheet.manager_approval) }}>
                                {timesheet.manager_approval}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-controls">
                <button 
                    className="pagination-button" 
                    onClick={handlePrevious} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <div className="page-numbers">
                    {pageNumbers.map(number => (
                        <button 
                            key={number} 
                            className={`page-number ${number === currentPage ? 'active' : ''}`}
                            onClick={() => handlePageNumberClick(number)}
                        >
                            {number}
                        </button>
                    ))}
                </div>
                <button 
                    className="pagination-button" 
                    onClick={handleNext} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Fulldetail;
