import config from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Assuming you have some CSS for styling

const Dashboard1 = () => {
    const [userid, setUserid] = useState('');
    const [personstatus, setPersonstatus] = useState('');
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Number of managers per page

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

        const fetchManagers = async () => {
            try {
                const response = await axios.get(`${config.API_URL}employee/`);
                const filteredManagers = response.data.filter(emp => emp.personstatus === 'Manager');
                setManagers(filteredManagers);
                console.log('Filtered Managers:', filteredManagers); // Debugging line
            } catch (error) {
                setError('Error fetching managers');
                console.error('Error fetching managers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchManagers();
    }, []);

    // Get current managers to display
    const indexOfLastManager = currentPage * itemsPerPage;
    const indexOfFirstManager = indexOfLastManager - itemsPerPage;
    const currentManagers = managers.slice(indexOfFirstManager, indexOfLastManager);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Button handlers
    const handleNext = () => {
        if (currentPage < Math.ceil(managers.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!managers.length) return <div>No managers found.</div>;

    return (
        <div className="dashboard">
            <div className="employee-list">
                <h2>Manager Timesheets</h2>
                <ul>
                    {currentManagers.map(manager => (
                        <li key={manager.emp_id}>
                            <Link to={`/timesheetsss/${manager.userid}`}>Timesheet for {manager.name}</Link>
                        </li>
                    ))}
                </ul>
                <div className="pagination">
                    <button onClick={handlePrevious} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span> Page {currentPage} of {Math.ceil(managers.length / itemsPerPage)} </span>
                    <button onClick={handleNext} disabled={currentPage === Math.ceil(managers.length / itemsPerPage)}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard1;
