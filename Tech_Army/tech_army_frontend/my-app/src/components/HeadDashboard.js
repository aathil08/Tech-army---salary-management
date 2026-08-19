import config from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Assuming you have some CSS for styling

const HeadDashboard = () => {
    const [userid, setUserid] = useState('');
    const [personstatus, setPersonstatus] = useState('');
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch userid and personstatus from local storage
        const storedUserid = localStorage.getItem('userid');
        const storedPersonstatus = localStorage.getItem('personstatus');

        console.log('Fetched userid:', storedUserid);
        console.log('Fetched personstatus:', storedPersonstatus);

        if (storedUserid) {
            setUserid(storedUserid);
        }
        if (storedPersonstatus) {
            setPersonstatus(storedPersonstatus);
        }

        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${config.API_URL}employee/`);
                setEmployees(response.data);
                console.log('Employees:', response.data); // Debugging line
            } catch (error) {
                setError('Error fetching employees');
                console.error('Error fetching employees:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!employees.length) return <div>No employees found.</div>;

    return (
        <div className="dashboard">
            <h1>Welcome {userid} !!</h1>
            
            <div className="employee-list">
                <h2>Team Members</h2>
                <ul>
                    {employees.map(employee => (
                        <li key={employee.emp_id}>
                            <Link to={`/employee/${employee.userid}`}>{employee.name}</Link>
                        </li>
                    ))}
                </ul>
               
            </div>
        </div>
    );
};

export default HeadDashboard;
