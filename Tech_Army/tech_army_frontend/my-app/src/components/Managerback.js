import config from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './EmployeeDetail.css';

const EmployeeDetail = () => {
    const { emp_id } = useParams();  // emp_id is a string
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        axios.get(`${config.API_URL}employee/?employee_id=${emp_id}`)
            .then(response => {
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setEmployee(response.data[0]);
                } else {
                    setEmployee(response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching employee details:', error);
            });
    }, [emp_id]);

    if (!employee) {
        return <div>Loading...</div>;
    }

    const projectName = employee?.project_name?.project_name || 'N/A';
    const moduleName = employee?.module_name?.module_name || 'N/A';

    return (
        <div className="employee-detail">
            <h1>Employee Detail for {employee?.employee?.name || 'N/A'}</h1>
            <p>Employee ID: {employee?.employee?.userid || 'N/A'}</p>
            <p>Email:{employee?.employee?.email|| 'N/A'}</p>
            <p>Team Name: {employee?.team_name || 'N/A'}</p>
            <p>Date: {employee?.date || 'N/A'}</p>
            <p>Comments: {employee?.comments || 'N/A'}</p>
            
            <Link to="/managerdetail" className="back-link">Back to Dashboard</Link>
        </div>
    );
};

export default EmployeeDetail;
