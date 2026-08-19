import config from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './TeamleaderSheetForm.css'; // Import your CSS file

const TeamleaderSheetForm = () => {
    const { userid } = useParams(); // Extract userid from URL
    const [formData, setFormData] = useState({
        project_name: '',
        module_name: '',
        userid: userid || '' // Set the default userid from URL
    });
    const [managerSheets, setManagerSheets] = useState([]);
    const [assignedModules, setAssignedModules] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the manager sheets
                const sheetsResponse = await axios.get(`${config.API_URL}manager/`);
                setManagerSheets(sheetsResponse.data);

                // Fetch the assigned modules
                const modulesResponse = await axios.get(`${config.API_URL}teamleader/`);
                const assigned = modulesResponse.data.map(item => item.module_name);
                setAssignedModules(assigned);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Check if the module is already assigned
            if (assignedModules.includes(formData.module_name)) {
                alert('This module has already been assigned.');
                setSuccess('');
                setIsSubmitting(false);
                return;
            }

            // Submit the form data to the backend
            await axios.post(`${config.API_URL}teamleader/`, formData);
            alert('Form submitted successfully.');
            setFormData({
                project_name: '',
                module_name: '',
                userid: userid || '' // Reset userid after submission
            });
            setError('');
            // Optionally, refetch the assigned modules to update the state
            const modulesResponse = await axios.get(`${config.API_URL}teamleader/`);
            const assigned = modulesResponse.data.map(item => item.module_name);
            setAssignedModules(assigned);
        } catch (err) {
            alert('Error submitting form.');
            console.error('Error submitting form:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="form-container">
            <h1 className="form-header">Assign Modules</h1>
            {success && <p className="message success">{success}</p>}
            <form onSubmit={handleSubmit} className="form-element">
                <div className="form-element">
                    <label>User ID:</label>
                    <select
                        name="userid"
                        value={formData.userid}
                        onChange={handleChange}
                        required
                        disabled
                    >
                        <option value={userid}>{userid}</option>
                    </select>
                </div>
                <div className="form-element">
                    <label>Project Name:</label>
                    <select
                        name="project_name"
                        value={formData.project_name}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a project</option>
                        {managerSheets.map(sheet => (
                            <option key={sheet.id} value={sheet.project_name}>
                                {sheet.project_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-element">
                    <label>Module Name:</label>
                    <input
                        type="text"
                        name="module_name"
                        value={formData.module_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
            {error && <p className="message error">{error}</p>}
        </div>
    );
};

export default TeamleaderSheetForm;
