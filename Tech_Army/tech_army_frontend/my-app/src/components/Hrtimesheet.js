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
    const [editingComment, setEditingComment] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 6;

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
                // Reverse the timesheets array for LIFO order
                setTimesheets(response.data.reverse());
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

    const handlePageChange = (direction) => {
        setCurrentPage(prevPage => {
            const newPage = direction === 'next'
                ? Math.min(prevPage + 1, Math.ceil(timesheets.length / entriesPerPage))
                : Math.max(prevPage - 1, 1);
            return newPage;
        });
    };

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = timesheets.slice(indexOfFirstEntry, indexOfLastEntry);

    const approveTimesheet = (timesheetId) => {
        axios.post(`${config.API_URL}timesheet/${timesheetId}/approve/`)
            .then(response => {
                setTimesheets(timesheets.map(timesheet =>
                    timesheet.id === timesheetId ? { ...timesheet, lead_approval: 'Approved' } : timesheet
                ));
            })
            .catch(error => {
                console.error('Error approving timesheet:', error);
            });
    };

    const rejectTimesheet = (timesheetId) => {
        axios.post(`${config.API_URL}timesheet/${timesheetId}/reject/`)
            .then(response => {
                setTimesheets(timesheets.map(timesheet =>
                    timesheet.id === timesheetId ? { ...timesheet, lead_approval: 'Rejected' } : timesheet
                ));
            })
            .catch(error => {
                console.error('Error rejecting timesheet:', error);
            });
    };

    const approveTimesheetByManager = (timesheetId) => {
        axios.post(`${config.API_URL}timesheet/${timesheetId}/manager_approve/`)
            .then(response => {
                setTimesheets(timesheets.map(timesheet =>
                    timesheet.id === timesheetId ? { ...timesheet, manager_approval: 'Approved' } : timesheet
                ));
            })
            .catch(error => {
                console.error('Error approving timesheet by manager:', error);
            });
    };

    const rejectTimesheetByManager = (timesheetId) => {
        axios.post(`${config.API_URL}timesheet/${timesheetId}/manager_reject/`)
            .then(response => {
                setTimesheets(timesheets.map(timesheet =>
                    timesheet.id === timesheetId ? { ...timesheet, manager_approval: 'Rejected' } : timesheet
                ));
            })
            .catch(error => {
                console.error('Error rejecting timesheet by manager:', error);
            });
    };

    const handleAddCommentClick = (timesheetId) => {
        setEditingComment(timesheetId);
    };

    const handleCommentChange = (event) => {
        setCommentText(event.target.value);
    };

    const handleCommentSubmit = (timesheetId) => {
        axios.post(`${config.API_URL}timesheet/${timesheetId}/add_comment/`, {
            comment: commentText
        })
        .then(response => {
            setTimesheets(timesheets.map(timesheet =>
                timesheet.id === timesheetId ? { ...timesheet, comment: commentText } : timesheet
            ));
            setEditingComment(null);
            setCommentText('');
        })
        .catch(error => {
            console.error('Error adding comment:', error);
        });
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
                        <th>Module Name</th>
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
                    {currentEntries.map(timesheet => (
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
                            <td>{timesheet.leave_days}</td>
                            <td>{timesheet.total}</td>
                            <td>{timesheet.salary}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-controls">
                <button
                    onClick={() => handlePageChange('prev')}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {Math.ceil(timesheets.length / entriesPerPage)}</span>
                <button
                    onClick={() => handlePageChange('next')}
                    disabled={currentPage === Math.ceil(timesheets.length / entriesPerPage)}
                >
                    Next
                </button>
            </div>
            <Link to="/time" className="back-link">Back to Dashboard</Link>
        </div>
    );
};

export default EmployeeTimesheet;
