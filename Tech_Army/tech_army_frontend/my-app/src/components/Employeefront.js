import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './front.css'; // Assuming you have some CSS for styling

const Dashboard = () => {
    const [userid, setUserid] = useState('');
    const [personstatus, setPersonstatus] = useState('');
    const [employees, setEmployees] = useState([]);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Number of employees per page

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

        const fetchUserName = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/user/${storedUserid}/`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/employee/');
                // Filter employees based on personstatus
                const filteredEmployees = response.data.filter(employee => employee.personstatus === 'Employee');
                setEmployees(filteredEmployees);
                console.log('Filtered Employees:', filteredEmployees); // Debugging line
            } catch (error) {
                setError('Error fetching employees');
                console.error('Error fetching employees:', error);
            } finally {
                setLoading(false);
            }
        };

        if (storedUserid) {
            fetchUserName();
        }
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
        <div className="leave-days-container">
            <h1>Welcome {userName} !!</h1> {/* Display the user's name */}
            <p>Have a nice day !!!!!!</p>
            
        </div>
    );
};

export default Dashboard;
