// src/components/PrivateLayout.js
import React from 'react';
import Sidebar from './Sidebar';
import './PrivateLayout.css'; // Assuming you have some CSS for layout styling

const PrivateLayout = ({ children }) => {
    return (
        <div className="private-layout">
            <Sidebar />
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default PrivateLayout;
