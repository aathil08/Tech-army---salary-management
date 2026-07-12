// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Dashboard1 from './components/Dashboard1';
import EmployeeDetail from './components/EmployeeDetail';
import EmployeeTimesheet from './components/EmployeeTimesheet';
import Login from './components/Login';
import ManagerDashboard from './components/ManagerDashboard';
import ManagerDashboard1 from './components/ManagerDashboard1';
import Sidebar from './components/Sidebar';
import Sidebar1 from './components/Sidebar1';
import Sidebar2 from './components/Sidebar2';
import './App.css';
import TimesheetForm from './components/TimesheetForm';
import TimesheetTable from './components/TimesheetTable';
import Leavedays from './components/Leavedays';
import ManagerSheetForm from './components/ManagerSheetForm';
import TeamleaderSheetForm from './components/TeamleaderSheetForm';
import Fulldetail from './components/Fulldetail';
import HeadDashboard from './components/HeadDashboard';
import CalculateSalary from './components/CalculateSalary';
import Sidebar3 from './components/Sidebar3';
import Hrmodule from './components/Hrmodule';
import Hrmod from './components/Hrmod';
import EmployeeDetail1 from './components/EmployeeDetail1';
import EmployeeTimesheet1 from './components/EmployeeTimesheet1';
import Dashboard3 from './components/Dashboard3';
import Projectdashboard from './components/Projectdashboard'
import Employeefront from './components/Employeefront'
import Hrtimesheet from './components/Hrtimesheet'
import Leadetail from './components/Leadetail'
import Leadtimesheet from './components/Leadtimesheet'
import Leadback from './components/Leadback'
import Leadtimeback from './components/Leadtimeback'
import Managerdetail from './components/Managerdetail'
import Managerback from './components/Managerback'
import Managertimesheet from './components/Managertimesheet'
import Managertimeback from './components/Managertimeback'
import Sidebar4 from './components/Sidebar4'
import Register from './components/Register'
import Deletedetail from './components/Deletedetail'
import SalaryHistory from './components/SalaryHistory';
import UpdateSalary from './components/UpdateSalary';
import DownloadTimesheet from './components/DownloadTimesheet';
function App() {
  const [personstatus, setPersonstatus] = useState('');

  useEffect(() => {
    const storedPersonstatus = localStorage.getItem('personstatus');
    if (storedPersonstatus) {
      setPersonstatus(storedPersonstatus);
    }
  }, []);

  const AppRouter = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem('userid');
      localStorage.removeItem('personstatus');
      navigate('/login');
    };

    const renderSidebar = () => {
      switch (personstatus) {
        case 'Employee':
          return <Sidebar2 onLogout={handleLogout} />;
        case 'Manager':
          return <Sidebar1 onLogout={handleLogout} />;
        case 'Lead':
          return <Sidebar onLogout={handleLogout} />;
        case 'HR':
          return <Sidebar3 onLogout={handleLogout} />;
        case 'Admin':
          return <Sidebar4 onLogout={handleLogout} />;
        default: 
          return null;
      }
    };

    return (
      <>
        {renderSidebar()}
        <Routes>
        
          <Route exact path="/lead-dashboard" element={<Dashboard />} />
          <Route exact path="/leadetail" element={<Leadetail />} />
          <Route exact path="/managerdetail" element={<Managerdetail />} />
          <Route exact path="/leadtimesheet" element={<Leadtimesheet />} />
          <Route exact path="/managertimesheet" element={<Managertimesheet />} />
          <Route exact path="/employeetimesheet" element={<Dashboard1 />} />
          <Route exact path="/employee/:emp_id" element={<EmployeeDetail />} />
          <Route exact path="/employees/:emp_id" element={<Leadback />} />
          <Route exact path="/employeess/:emp_id" element={<Managerback />} />
          <Route exact path="/timesheet/:emp_id" element={<EmployeeTimesheet />} />
          <Route exact path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route exact path="/manager" element={<ManagerDashboard1 />} />
          <Route exact path="/employee-dashboard" element={<TimesheetForm />} />
          <Route exact path="/view" element={<TimesheetTable />} />
          <Route exact path="/leave" element={<Leavedays />} />
          <Route exact path="/proj/:userid" element={<ManagerSheetForm />} />
          <Route exact path="/mod/:userid" element={<TeamleaderSheetForm />} />
          <Route exact path="/mods" element={<Dashboard3 />} />
          <Route exact path="/projs" element={<Projectdashboard />} />
          <Route exact path="/full" element={<Fulldetail/>} />
          <Route exact path="/salary" element={<CalculateSalary />} />
          <Route exact path="/hr" element={<HeadDashboard />} />
          <Route exact path="/detail" element={<Hrmodule />} />
          <Route exact path="/time" element={<Hrmod/>} />
          <Route exact path="/employee1/:emp_id" element={<EmployeeDetail1 />} />
          <Route exact path="/timesheet1/:emp_id" element={<EmployeeTimesheet1 />} />
          <Route exact path="/front" element={<Employeefront/>} />
          <Route exact path="/timesheets/:emp_id" element={<Hrtimesheet />} />
          <Route exact path="/timesheetss/:emp_id" element={<Leadtimeback />} />
          <Route exact path="/timesheetsss/:emp_id" element={<Managertimeback/>} />
          <Route exact path="/register" element={<Register/>} />
          <Route exact path="/deleteds" element={<Deletedetail/>} />
        </Routes>
      </>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={() => setPersonstatus(localStorage.getItem('personstatus'))} />} />
        <Route path="/login" element={<Login onLogin={() => setPersonstatus(localStorage.getItem('personstatus'))} />} />
        <Route path="/*" element={<AppRouter />} />
        <Route path="/salary-history/" element={<SalaryHistory />} />

        <Route path="/update-salary/:employeeId/" element={<UpdateSalary />} />
         <Route path="/download-timesheet/" element={<DownloadTimesheet />} />
        


      </Routes>
    </Router>
  );
}

export default App;
