
// src/Sidebar.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faHome, faFileAlt, faChartBar, faTasks, faStar, faUsers, faDollarSign, faCogs } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import companyLogo from '../assets/company-logo.png';
const Sidebar3 = ({ onCalendarClick }) => {
  return (
    <div className="sidebar">
      <div className="sidebar1">
        <img src={companyLogo} alt="Company Logo" className="sidebar-logo" /> {/* Add the logo here */}
        
      </div>
      <div className="sidebar-title">
        <FontAwesomeIcon icon={faClock} />
        <span>HR Dashboard</span>
      </div>
      <div className="sidebar-search">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="sidebar-menu">
        <div className="sidebar-item">
          <FontAwesomeIcon icon={faHome} />
          <span><Link to="/detail" className="sidebar-link">EmployeeDetail</Link></span>
        </div>
        <div className="sidebar-item">
          <FontAwesomeIcon icon={faFileAlt} />
          <span><Link to="/time" className="sidebar-link">EmployeeTimesheet</Link></span>
        </div>
        <div className="sidebar-item">
          <FontAwesomeIcon icon={faFileAlt} />
          <span><Link to="/leadetail" className="sidebar-link">LeadDetail</Link></span>
        </div>
        <div className="sidebar-item">
          <FontAwesomeIcon icon={faFileAlt} />
          <span><Link to="/leadtimesheet" className="sidebar-link">LeadTimesheet</Link></span>
        </div>
        <div className="sidebar-item">
          <FontAwesomeIcon icon={faFileAlt} />
          <span><Link to="/managerdetail" className="sidebar-link">ManagerDetail</Link></span>
        </div>
        <div className="sidebar-item">
          <FontAwesomeIcon icon={faFileAlt} />
          <span><Link to="/managertimesheet" className="sidebar-link">ManagerTimesheet</Link></span>
        </div>
        <div className="sidebar-item">
          <FontAwesomeIcon icon={faFileAlt} />
          <span><Link to="/salary" className="sidebar-link">Salary Calculation</Link></span>
        </div>

        <div className="sidebar-item">
          <FontAwesomeIcon icon={faChartBar} />
          <span><Link to="/salary-history" className="sidebar-link">salary history</Link></span>
        </div>

         <div className="sidebar-item">
          <FontAwesomeIcon icon={faChartBar} />
          <span><Link to="/update-salary/:employeeId" className="sidebar-link">update salary</Link></span>
        </div>
       
        <div className="sidebar-item">
          <FontAwesomeIcon icon={faChartBar} />
          <span><Link to="/login" className="sidebar-link">Logout</Link></span>
        </div>

        </div>
    </div>
  );
};
export default Sidebar3;
