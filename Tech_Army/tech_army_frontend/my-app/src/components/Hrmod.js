import config from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Assuming you have some CSS for styling

const Dashboard1 = () => {
    const [userid, setUserid] = useState('');
    const [personstatus, setPersonstatus] = useState('');
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Number of employees per page

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
                const filteredEmployees = response.data.filter(emp => emp.personstatus === 'Employee');
                setEmployees(filteredEmployees);
                console.log('Filtered Employees:', filteredEmployees); // Debugging line
            } catch (error) {
                setError('Error fetching employees');
                console.error('Error fetching employees:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    // Get current employees to display
    const indexOfLastEmployee = currentPage * itemsPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
    const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Button handlers
    const handleNext = () => {
        if (currentPage < Math.ceil(employees.length / itemsPerPage)) {
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
    if (!employees.length) return <div>No employees found.</div>;

    return (
        <div className="dashboard">
            
            <div className="employee-list">
                <h2>Timesheets</h2>
                <ul>
                    {currentEmployees.map(employee => (
                        <li key={employee.emp_id}>
                            <Link to={`/timesheets/${employee.userid}`}>Timesheet for {employee.name}</Link>
                        </li>
                    ))}
                </ul>
                <div className="pagination">
                    <button onClick={handlePrevious} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span> Page {currentPage} of {Math.ceil(employees.length / itemsPerPage)} </span>
                    <button onClick={handleNext} disabled={currentPage === Math.ceil(employees.length / itemsPerPage)}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard1;
