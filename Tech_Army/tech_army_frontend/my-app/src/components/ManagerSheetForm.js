import config from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './projects.css';

const ManagerSheetForm = () => {
    const [projectName, setProjectName] = useState('');
    const [deadLine, setDeadLine] = useState('');
    const [teamLeaders, setTeamLeaders] = useState([]);
    const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { team_leader_id } = useParams(); // Read team_leader_id from URL

    useEffect(() => {
        const fetchTeamLeaders = async () => {
            try {
                const response = await axios.get(`${config.API_URL}leads/`);
                setTeamLeaders(response.data);

                // Set the selected team leader if available
                if (team_leader_id) {
                    setSelectedTeamLeader(team_leader_id);
                }
            } catch (err) {
                console.error('Error fetching team leaders:', err);
                alert('Failed to fetch team leaders.');
            }
        };
        fetchTeamLeaders();
    }, [team_leader_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${config.API_URL}manager/`, {
                project_name: projectName,
                dead_line: deadLine,
                team_leader: selectedTeamLeader,
            });
            console.log('Manager sheet created:', response.data);
            alert('Manager sheet created successfully.');
            setError('');
            setProjectName('');
            setDeadLine('');
            setSelectedTeamLeader('');
        } catch (err) {
            console.error('Error creating manager sheet:', err.response ? err.response.data : err.message);
            alert('Failed to create manager sheet.');
            setSuccess('');
        }
    };

    return (
        <div className="form-container">
            <h1 className="form-header">Assign project</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit} className="form-element">
                <div className="form-element">
                    <label htmlFor="project_name">Project Name:</label>
                    <input
                        type="text"
                        id="project_name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-element">
                    <label htmlFor="dead_line">Deadline:</label>
                    <input
                        type="date"
                        id="dead_line"
                        value={deadLine}
                        onChange={(e) => setDeadLine(e.target.value)}
                        required
                    />
                </div>
                <div className="form-element">
                    <label htmlFor="team_leader">Team Leader:</label>
                    <select
                        id="team_leader"
                        value={selectedTeamLeader}
                        onChange={(e) => setSelectedTeamLeader(e.target.value)}
                        required
                    >
                        <option value="">Select Team Leader</option>
                        {teamLeaders.map((leader) => (
                            <option key={leader.userid} value={leader.userid}>
                                {leader.userid}-{leader.name} {/* Adjust if `name` is available */}
                            </option>
                        ))}
                    </select>
                    
                </div>
                <br></br>
                <button type="submit" className="submit-button" >Submit</button>
            </form>
        </div>
    );
};

export default ManagerSheetForm;
