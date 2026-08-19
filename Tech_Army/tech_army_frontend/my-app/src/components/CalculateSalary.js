import config from '../config';
import React, { useState, useEffect } from 'react';
import './salary.css';

const CalculateSalary = () => {
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState('');
    const [userOptions, setUserOptions] = useState([]);
    const [salary, setSalary] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [workingHours, setWorkingHours] = useState(null);
    const [leaveDays, setLeaveDays] = useState(null);

    useEffect(() => {
        if (role) {
            const fetchUserOptions = async () => {
                try {
                    const response = await fetch(`${config.API_URL}${role.toLowerCase()}s/`);
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Fetched user options:', data); // Debug log
                        setUserOptions(data.map(user => ({ id: user.userid, name: user.name })));
                    } else {
                        const errorData = await response.json();
                        console.error('Fetch error:', errorData); // Debug log
                        setError(errorData.error || `An error occurred while fetching ${role} options.`);
                    }
                } catch (error) {
                    console.error('Fetch exception:', error); // Debug log
                    setError(`An error occurred while fetching ${role} options.`);
                }
            };

            fetchUserOptions();
        }
    }, [role]);

    const handleRoleChange = (event) => {
        setRole(event.target.value);
        setUserOptions([]);
        setUserId('');
    };

    const handleDropdownChange = (event) => {
        setUserId(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setWorkingHours(null);
        setLeaveDays(null);
        setError(null);
        setSalary(null);

        try {
            const response = await fetch(`${config.API_URL}calculate-salary/${userId}/`);
            if (response.ok) {
                const data = await response.json();
                setSalary(data.total_salary);
                setWorkingHours(data.total_working_hours);
                setLeaveDays(data.Leave_days);

                // Remove the calculated user from the list
                setUserOptions(prevOptions => prevOptions.filter(user => user.id !== userId));
                setUserId('');
            } else {
                const errorData = await response.json();
                console.error('Calculation error:', errorData); // Debug log
                setError(errorData.error || 'An error occurred');
            }
        } catch (error) {
            console.error('Calculation exception:', error); // Debug log
            setError('An error occurred while calculating the salary.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setRole('');
        setUserId('');
        setUserOptions([]);
        setSalary(null);
        setWorkingHours(null);
        setLeaveDays(null);
        setError(null);
    };

    return (
        <div className="container">
            <h2>Calculate Employee Salary</h2>
            <form onSubmit={handleSubmit} className="form">
                <label className="role">Select Role:</label>
                <select
                    id="role"
                    value={role}
                    onChange={handleRoleChange}
                    className="input"
                    required
                >
                    <option value="" disabled>Select a role</option>
                    <option value="Lead">Lead</option>
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                </select>

                {role && (
                    <>
                        <label htmlFor="user-id">User ID:</label>
                        <select
                            id="user-id"
                            value={userId}
                            onChange={handleDropdownChange}
                            className="input"
                            required
                        >
                            <option value="" disabled>Select a user</option>
                            {userOptions.map(option => (
                                <option key={option.id} value={option.id}>{option.name} ({option.id})</option>
                            ))}
                        </select>
                    </>
                )}

                <button type="submit" className="button" disabled={loading || !userId}>
                    {loading ? 'Calculating...' : 'Calculate Salary'}
                </button>
                <button type="button" onClick={handleClear} className="button1">
                    Clear
                </button>
            </form>
            {error && <div className="error">{error}</div>}
            {salary !== null && !error && (
                <div className="result">
                    <center>
                        <p><b>Working Hours of {userId}: {workingHours}</b></p>
                        <p><b>Number of Leave Days: {leaveDays}</b></p>
                        <p><b>Total Salary for User ID {userId}: ₹{salary}</b></p>
                    </center> 
                </div>
            )}
        </div>
    );
};

export default CalculateSalary;
