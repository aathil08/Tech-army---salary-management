import config from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './module.css';

const Dashboard3 = () => {
    const [userid, setUserid] = useState('');
    const [personstatus, setPersonstatus] = useState('');
    const [employees, setEmployees] = useState([]);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUserid = localStorage.getItem('userid');
        const storedPersonstatus = localStorage.getItem('personstatus');
        if (storedUserid) {
            setUserid(storedUserid);
        }
        if (storedPersonstatus) {
            setPersonstatus(storedPersonstatus);
        }

        const fetchUserName = async () => {
            try {
                const response = await axios.get(`${config.API_URL}user/${storedUserid}/`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        const fetchEmployees = async () => {
            try {
                const employeesResponse = await axios.get(`${config.API_URL}employee/`);
                const filteredEmployees = employeesResponse.data
                    .filter(employee => employee.personstatus === 'Lead');
                setEmployees(filteredEmployees);
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

    const indexOfLastEmployee = currentPage * itemsPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
    const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    if (!employees.length) return <div>No team leaders found.</div>;

    const handleEmployeeClick = (userid) => {
        navigate(`/proj/${userid}`); // Update the URL
    };

    return (
        <div className="dashboard">
            <div className="employee-list">
                <h2>Team Leaders</h2>
                <ul>
                    {currentEmployees.map(employee => (
                        <li key={employee.emp_id}>
                            <span onClick={() => handleEmployeeClick(employee.userid)} style={{ cursor: 'pointer', color: '#0C134F' }}>
                                {employee.name} - {employee.userid}
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="pagination">
                    <button onClick={handlePrevious} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>Page {currentPage} of {Math.ceil(employees.length / itemsPerPage)}</span>
                    <button onClick={handleNext} disabled={currentPage === Math.ceil(employees.length / itemsPerPage)}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard3;
