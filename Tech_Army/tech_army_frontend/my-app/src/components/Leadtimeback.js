import config from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './EmployeeTimesheet.css';

const EmployeeTimesheet = () => {
    const { emp_id } = useParams();
    const [timesheets, setTimesheets] = useState([]);
    const [employee, setEmployee] = useState(null);
    const [personstatus, setPersonstatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const timesheetsPerPage = 6; // Number of timesheets to show per page

    useEffect(() => {
        const storedUserid = localStorage.getItem('userid');
        const storedPersonstatus = localStorage.getItem('personstatus');

        if (storedUserid) {
            // Assume userid can be used if needed
        }
        if (storedPersonstatus) {
            setPersonstatus(storedPersonstatus);
        }

        axios.get(`${config.API_URL}employee/?employee_id=${emp_id}`)
            .then(response => {
                setEmployee(response.data);
            })
            .catch(error => {
                console.error('Error fetching employee details:', error);
            });

        axios.get(`${config.API_URL}timesheet/?employee=${emp_id}`)
            .then(response => {
                setTimesheets(response.data);
            })
            .catch(error => {
                console.error('Error fetching timesheets:', error);
            });

        axios.get(`${config.API_URL}user/status/`)
            .then(response => {
                setPersonstatus(response.data.person_status);
            })
            .catch(error => {
                console.error('Error fetching user status:', error);
            });
    }, [emp_id]);

    // Calculate pagination details
    const indexOfLastTimesheet = currentPage * timesheetsPerPage;
    const indexOfFirstTimesheet = indexOfLastTimesheet - timesheetsPerPage;
    const currentTimesheets = timesheets.slice(indexOfFirstTimesheet, indexOfLastTimesheet);
    const totalPages = Math.ceil(timesheets.length / timesheetsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (!employee || !timesheets.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className="employee-timesheet">
            <h1>Timesheet Detail</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Project Name</th>
                        
                        <th>Week</th>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thu</th>
                        <th>Fri</th>
                        <th>Leave Days</th>
                        <th>Total</th>
                        <th>Salary</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTimesheets.slice().reverse().map(timesheet => (
                        <tr key={timesheet.id}>
                            <td>{timesheet.employee}</td>
                            <td>{timesheet.project_name}</td>
                            <td>{timesheet.week}</td>
                            <td>{timesheet.mon}</td>
                            <td>{timesheet.tue}</td>
                            <td>{timesheet.wed}</td>
                            <td>{timesheet.thu}</td>
                            <td>{timesheet.fri}</td>
                            <td>{timesheet.leave_days}</td>
                            <td>{timesheet.total}</td>
                            <td>{timesheet.salary}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    Previous
                </button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                >
                    Next
                </button>
            </div>
            <Link to="/leadtimesheet" className="back-link">Back to Dashboard</Link>
        </div>
    );
};

export default EmployeeTimesheet;
