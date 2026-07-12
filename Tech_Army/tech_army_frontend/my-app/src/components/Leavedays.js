import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leavedays.css'; // Import the CSS file

const Leavedays = () => {
    const [leaveDays, setLeaveDays] = useState(0);
    const [userid, setUserid] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const storedUserid = localStorage.getItem('userid');
        
        console.log('Fetched userid:', storedUserid);
        
        if (storedUserid) {
            setUserid(storedUserid);
        }
    }, []);

    useEffect(() => {
        if (userid) {
            const fetchData = async () => {
                try {
                    // Fetch timesheet data
                    const timesheetResponse = await axios.get('http://127.0.0.1:8000/api/timesheet/user_timesheets/', {
                        params: { user_id: userid }
                    });

                    console.log('Timesheet API Response:', timesheetResponse.data);

                    const timesheets = timesheetResponse.data;

                    let totalLeaveDays = 0;

                    if (Array.isArray(timesheets)) {
                        timesheets.forEach(timesheet => {
                            console.log('Timesheet:', timesheet);

                            const days = [
                                timesheet.mon || 0,
                                timesheet.tue || 0,
                                timesheet.wed || 0,
                                timesheet.thu || 0,
                                timesheet.fri || 0
                            ];

                            const leaveDaysCalculated = days.filter(day => day === 0).length;
                            totalLeaveDays += leaveDaysCalculated;
                        });
                    } else {
                        console.error('Timesheets data is not an array:', timesheets);
                    }

                    setLeaveDays(totalLeaveDays);

                    // Fetch user details using the `userid` state
                    const userResponse = await axios.get(`http://127.0.0.1:8000/api/user/${userid}/`);
                    console.log('User API Response:', userResponse.data);
                    setUserName(userResponse.data.name);

                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }
    }, [userid]);

    return (
        <div className="leave-days-container">
            <h2>Leave Days Calculation</h2>
            <h3 className="leave-days-header">Leave Days for the employee: {userName || userid}</h3>
            <div className="leave-days-content">
                <h3 className="leave-days-count">Leave Days: {leaveDays}</h3>
            </div>
        </div>
    );
};

export default Leavedays;
