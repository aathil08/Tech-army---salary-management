import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './module.css'; // Assuming you have some CSS for styling

const Dashboard3 = () => {
    const [userid, setUserid] = useState('');
    const [personstatus, setPersonstatus] = useState('');
    const [employees, setEmployees] = useState([]);
    const [userName, setUserName] = useState('');
    const [assignedModules, setAssignedModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Number of employees per page

    const navigate = useNavigate();

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
                const [employeesResponse, modulesResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/employee/'),
                    axios.get('http://127.0.0.1:8000/api/teamleader/')
                ]);

                // Extract assigned user IDs from teamleader modules
                const assignedUserIds = modulesResponse.data.map(item => item.userid);

                // Filter employees based on personstatus and assigned modules
                const filteredEmployees = employeesResponse.data
                    .filter(employee => employee.personstatus === 'Employee' && !assignedUserIds.includes(employee.userid));

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

    const handleEmployeeClick = (userid) => {
        // Navigate to the TeamleaderSheetForm with the selected userid
        navigate(`/mod/${userid}`);
    };

    return (
        <div className="dashboard">
            <div className="employee-list">
                <h2>Team Members</h2>
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
