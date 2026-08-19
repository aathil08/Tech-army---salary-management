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
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

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

    const filteredTimesheets = timesheets.filter(timesheet => {
        if (personstatus === 'Lead') {
            return timesheet.lead_approval.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (personstatus === 'Manager') {
            return timesheet.manager_approval.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    // Calculate the current set of timesheets based on pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTimesheets = filteredTimesheets.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredTimesheets.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage(prevPage => (prevPage < totalPages ? prevPage + 1 : prevPage));
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
    };

    if (!employee || !timesheets.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className="employee-timesheet">
            <h1>Timesheet Detail</h1>
            <input
                type="text"
                placeholder="Search by status (Approved, Rejected, Pending)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
            />
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
                        <th>Total</th>
                        {personstatus === 'Lead' && <th>Lead Approval</th>}
                        {personstatus === 'Manager' && (
                            <>
                                <th>Lead Approval</th>
                                <th>Manager Approval</th>
                            </>
                        )}
                        <th>Comments</th>
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
                            {personstatus === 'Lead' && (
                                <td>
                                    {timesheet.lead_approval === 'Pending' ? (
                                        <>
                                            <button className="approve-button" onClick={() => approveTimesheet(timesheet.id)}>Approve</button>
                                            <button className="reject-button" onClick={() => rejectTimesheet(timesheet.id)}>Reject</button>
                                        </>
                                    ) : (
                                        timesheet.lead_approval
                                    )}
                                </td>
                            )}
                            {personstatus === 'Manager' && (
                                <>
                                    <td>{timesheet.lead_approval}</td>
                                    <td>
                                        {timesheet.manager_approval === 'Pending' ? (
                                            <>
                                                <button className="approve-button" onClick={() => approveTimesheetByManager(timesheet.id)}>Approve</button>
                                                <button className="reject-button" onClick={() => rejectTimesheetByManager(timesheet.id)}>Reject</button>
                                            </>
                                        ) : (
                                            timesheet.manager_approval
                                        )}
                                    </td>
                                </>
                            )}
                            <td>
                                {editingComment === timesheet.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={commentText}
                                            onChange={handleCommentChange}
                                            placeholder="Enter comment"
                                        />
                                        <button
                                            className="submit-button"
                                            onClick={() => handleCommentSubmit(timesheet.id)}
                                        >
                                            Submit
                                        </button>
                                    </>
                                ) : (
                                    timesheet.comment || (
                                        <button
                                            className="add-comment-button"
                                            onClick={() => handleAddCommentClick(timesheet.id)}
                                        >
                                            Add
                                        </button>
                                    )
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
            <Link to="/employeetimesheet" className="back-link">Back to Dashboard</Link>
        </div>
    );
};

export default EmployeeTimesheet;
