// MainLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './MainLayout.css'; // Your CSS for layout

const MainLayout = () => {
    return (
        <div className="main-layout">
            <Sidebar />
            <div className="main-content">
                <Outlet /> {/* Renders the nested routes */}
            </div>
        </div>
    );
};

export default MainLayout;
