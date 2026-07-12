import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TimesheetForm.css';

const TimesheetForm = () => {
  const [userid, setUserid] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    week: '',
    mon: '',
    tue: '',
    wed: '',
    thu: '',
    fri: '',
    total: '',
    lead_approval: 'Pending',
    project_name: '',
    module_name: '',
    team_name: '',
    comments:'comments'
  });
  const [submittedData, setSubmittedData] = useState(null);
  const [timesheets, setTimesheets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/timesheet/');
        setTimesheets(response.data);
      } catch (error) {
        console.error('Error fetching timesheets:', error);
      }
    };

    const fetchProjectsAndModules = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/teamleader/');
        console.log("Team Leader Data:", response.data);

        if (Array.isArray(response.data)) {
          const projects = response.data.map(item => item.project_name || '');
          const modules = response.data.map(item => item.module_name || '');

          setProjects([...new Set(projects)]);
          setModules([...new Set(modules)]);
        } else {
          console.error('Unexpected data format from teamleader API');
        }
      } catch (error) {
        console.error('Error fetching projects and modules:', error);
      }
    };

    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/employee/');
        console.log("Employee Data:", response.data);

        const teamNames = response.data.map(item => item.team_name || '');
        setTeams([...new Set(teamNames)]);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTimesheets();
    fetchProjectsAndModules();
    fetchTeams();
  }, []);

  useEffect(() => {
    const storedUserid = localStorage.getItem('userid');
    if (storedUserid) {
      setFormData((prevData) => ({
        ...prevData,
        id: storedUserid,
      }));
      setUserid(storedUserid);
    }
  }, []);

  useEffect(() => {
    const totalHours =
      parseFloat(formData.mon || 0) +
      parseFloat(formData.tue || 0) +
      parseFloat(formData.wed || 0) +
      parseFloat(formData.thu || 0) +
      parseFloat(formData.fri || 0);
    setFormData((prevData) => ({
      ...prevData,
      total: totalHours,
    }));
  }, [formData.mon, formData.tue, formData.wed, formData.thu, formData.fri]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/timesheet/add/', formData);
      setSubmittedData(response.data);
      setShowForm(false);
      setTimesheets([...timesheets, response.data]);
    } catch (error) {
      console.error('Error submitting timesheet:', error);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const togglePopup = (data) => {
    setSubmittedData(submittedData === data ? null : data);
  };

  const renderCalendar = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = endOfMonth.getDate();
    const startDay = startOfMonth.getDay();

    const calendarDays = [];

    // Days of the week headers
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekDays.forEach(day => {
      calendarDays.push(
        <div key={day} className="calendar-header-day">{day}</div>
      );
    });

    // Empty placeholders for days before the start of the month
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-day"></div>);
    }

    // Days of the month with timesheet or add button
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const timesheet = timesheets.find((ts) => new Date(ts.week).toDateString() === date.toDateString());
      const isMonday = date.getDay() === 1;

      calendarDays.push(
        <div key={day} className="button">
          <div>{day}</div>
          {timesheet ? (
            <div className="circle" onClick={() => togglePopup(timesheet)}>
              {timesheet.total}
            </div>
          ) : (
            isMonday && (
              <button className="add-button" onClick={toggleForm}>+</button>
            )
          )}
        </div>
      );
    }

    return <div className="calendar">{calendarDays}</div>;
  };

  return (
    <div className="container1">
      <div>
        
      </div>
      <div className="calendar-header">
        <button className="buttonz" onClick={handlePreviousMonth}>Previous</button>
        <div className="button2">{currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}</div>
        <button className="buttonz" onClick={handleNextMonth}>Next</button>
      </div>
      
      {renderCalendar()}
      {showForm && (
        <form className="form-popup" onSubmit={handleSubmit}>
          <div>
            <label>Employee</label>
            <input
              type="text"
              name="employee"
              value={userid}
              readOnly
            />
          </div>
          <div>
            
            <label>Week</label>
            <select
              name="week"
              value={formData.week}
              onChange={handleChange}
            >
              <option value="">Select Week</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div>
            <label>Mon</label>
            <input
              type="number"
              name="mon"
              value={formData.mon}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Tue</label>
            <input
              type="number"
              name="tue"
              value={formData.tue}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Wed</label>
            <input
              type="number"
              name="wed"
              value={formData.wed}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Thu</label>
            <input
              type="number"
              name="thu"
              value={formData.thu}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Fri</label>
            <input
              type="number"
              name="fri"
              value={formData.fri}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Total</label>
            <input
              type="number"
              name="total"
              value={formData.total}
              readOnly
            />
          </div>
          <div>
            <label>Project Name</label>
            <select
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Module Name</label>
            <select
              name="module_name"
              value={formData.module_name}
              onChange={handleChange}
            >
              <option value="">Select Module</option>
              {modules.map(module => (
                <option key={module} value={module}>
                  {module}
                </option>
              ))}
            </select>

          </div>
          
          
          <button type="submit" className="buttonee">Submit</button>
          <button type="button" className="button cancel-button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}
      {submittedData && (
        <div className="submitted-data">
          <h3>Submitted Timesheet</h3>
          <p>Employee: {submittedData.employee}</p>
          <p>Project Name: {submittedData.project_name}</p>
          <p>Module Name: {submittedData.module_name}</p>
          <p>Week: {submittedData.week}</p>
          <p>Monday: {submittedData.mon}</p>
          <p>Tuesday: {submittedData.tue}</p>
          <p>Wednesday: {submittedData.wed}</p>
          <p>Thursday: {submittedData.thu}</p>
          <p>Friday: {submittedData.fri}</p>
          <p>Total Hours: {submittedData.total}</p>
          
          <button className="button cancel-button" onClick={() => togglePopup(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default TimesheetForm;
