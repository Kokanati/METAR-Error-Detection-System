// src/components/WelcomeBanner.jsx
import React from 'react';
import { useFormData } from '../context/FormContext';
import '../App.css';

const WelcomeBanner = () => {
    const { formData } = useFormData();
    const username = formData.username || 'Observer';

    return (
        <div className="welcome-banner">
            <div className="banner-content">
                <h2>👋 Welcome to <span className="meds-name">MEDSystem</span>, <span className="username">{username}</span>!</h2>
                <p>Your real-time METAR validation assistant.</p>
            </div>
        </div>
    );
};

export default WelcomeBanner;
