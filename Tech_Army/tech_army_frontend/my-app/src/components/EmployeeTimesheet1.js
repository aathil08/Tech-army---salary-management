import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './EmployeeTimesheet.css';

const EmployeeTimesheet = () => {
    const { emp_id } = useParams();
    const [timesheets, setTimesheets] = useState([]);
    const [employee, setEmployee] = useState(null);
    const [personstatus, setPersonstatus] = useState('');

    useEffect(() => {
        const storedUserid = localStorage.getItem('userid');
        const storedPersonstatus = localStorage.getItem('personstatus');

        if (storedUserid) {
            // Assume userid can be used if needed
        }
        if (storedPersonstatus) {
            setPersonstatus(storedPersonstatus);
        }

        axios.get(`http://127.0.0.1:8000/api/employee/?employee_id=${emp_id}`)
            .then(response => {
                setEmployee(response.data);
            })
            .catch(error => {
                console.error('Error fetching employee details:', error);
            });

        axios.get(`http://127.0.0.1:8000/api/timesheet/?employee=${emp_id}`)
            .then(response => {
                setTimesheets(response.data);
            })
            .catch(error => {
                console.error('Error fetching timesheets:', error);
            });

        axios.get(`http://127.0.0.1:8000/api/user/status/`)
            .then(response => {
                setPersonstatus(response.data.person_status);
            })
            .catch(error => {
                console.error('Error fetching user status:', error);
            });
    }, [emp_id]);

    const approveTimesheet = (timesheetId) => {
        axios.post(`http://127.0.0.1:8000/api/timesheet/${timesheetId}/approve/`)
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
        axios.post(`http://127.0.0.1:8000/api/timesheet/${timesheetId}/reject/`)
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
        axios.post(`http://127.0.0.1:8000/api/timesheet/${timesheetId}/manager_approve/`)
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
        axios.post(`http://127.0.0.1:8000/api/timesheet/${timesheetId}/manager_reject/`)
            .then(response => {
                setTimesheets(timesheets.map(timesheet =>
                    timesheet.id === timesheetId ? { ...timesheet, manager_approval: 'Rejected' } : timesheet
                ));
            })
            .catch(error => {
                console.error('Error rejecting timesheet by manager:', error);
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
                        <th>Total</th>
                        {personstatus === 'Lead' && <th>Lead Approval</th>}
                        {personstatus === 'Manager' && (
                            <>
                                <th>Lead Approval</th>
                                <th>Manager Approval</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {timesheets.map(timesheet => (
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
                                            <button className="button-group" onClick={() => approveTimesheet(timesheet.id)}>Approve</button>
                                            <button className="button-group" onClick={() => rejectTimesheet(timesheet.id)}>Reject</button>
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
                                                <button className="button-group" onClick={() => approveTimesheetByManager(timesheet.id)}>Approve</button>
                                                <button className="button-group" onClick={() => rejectTimesheetByManager(timesheet.id)}>Reject</button>
                                            </>
                                        ) : (
                                            timesheet.manager_approval
                                        )}
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/time" className="back-link">Back to Dashboard</Link>
        </div>
    );
};

export default EmployeeTimesheet;
