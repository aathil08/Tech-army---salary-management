// src/Sidebar.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faHome,
  faFileAlt,
  faChartBar,
  faTasks,
  faStar,
  faUsers,
  faDollarSign,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import companyLogo from "../assets/company-logo.png"; // Import your logo image

const Sidebar = ({ onLogout }) => {
  return (
    <div className="sidebar">
      <div className="sidebar1">
        <img src={companyLogo} alt="Company Logo" className="sidebar-logo" />{" "}
        {/* Add the logo here */}
      </div>
      <div className="sidebar-title">
        <span className="one">Lead Dashboard</span>
      </div>
      <div className="sidebar-search">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="sidebar-menu">
        <div className="sidebar-item">
          <FontAwesomeIcon icon={faHome} />
          <span>
            <Link to="/lead-dashboard" className="sidebar-link">
              EmployeeDetail
            </Link>
          </span>
        </div>
        <div className="sidebar-item">
          <FontAwesomeIcon icon={faFileAlt} />
          <span>
            <Link to="/employeetimesheet" className="sidebar-link">
              EmployeeTimesheet
            </Link>
          </span>
        </div>
        <div className="sidebar-item">
          <FontAwesomeIcon icon={faChartBar} />
          <span>
            <Link to="/mods" className="sidebar-link">
              Module Assigning
            </Link>
          </span>
        </div>

        <div className="sidebar-item">
          <FontAwesomeIcon icon={faHome} />
          <span>
            <Link to="/employee-dashboard" className="sidebar-link">
              Add Timesheet
            </Link>
          </span>
        </div>
        <div className="sidebar-item">
          <FontAwesomeIcon icon={faChartBar} />
          <span>
            <Link to="/leave" className="sidebar-link">
              attendance
            </Link>
          </span>
        </div>
        <div className="sidebar-item">
          <FontAwesomeIcon icon={faChartBar} />
          <span>
            <button className="sidebar-link" onClick={onLogout}>
              Logout
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
