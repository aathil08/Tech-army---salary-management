import config from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Assuming you have some CSS for styling

const Dashboard1 = () => {
    const [userid, setUserid] = useState('');
    const [personstatus, setPersonstatus] = useState('');
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Number of leads per page

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

        const fetchLeads = async () => {
            try {
                const response = await axios.get(`${config.API_URL}employee/`);
                const filteredLeads = response.data.filter(emp => emp.personstatus === 'Lead');
                setLeads(filteredLeads);
                console.log('Filtered Leads:', filteredLeads); // Debugging line
            } catch (error) {
                setError('Error fetching leads');
                console.error('Error fetching leads:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    // Get current leads to display
    const indexOfLastLead = currentPage * itemsPerPage;
    const indexOfFirstLead = indexOfLastLead - itemsPerPage;
    const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Button handlers
    const handleNext = () => {
        if (currentPage < Math.ceil(leads.length / itemsPerPage)) {
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
    if (!leads.length) return <div>No leads found.</div>;

    return (
        <div className="dashboard">
            <div className="employee-list">
                <h2>Lead Timesheets</h2>
                <ul>
                    {currentLeads.map(lead => (
                        <li key={lead.emp_id}>
                            <Link to={`/timesheetss/${lead.userid}`}>Timesheet for {lead.name}</Link>
                        </li>
                    ))}
                </ul>
                <div className="pagination">
                    <button onClick={handlePrevious} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span> Page {currentPage} of {Math.ceil(leads.length / itemsPerPage)} </span>
                    <button onClick={handleNext} disabled={currentPage === Math.ceil(leads.length / itemsPerPage)}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard1;
