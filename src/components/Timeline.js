// components/Timeline.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaStore, FaTshirt, FaUtensils, FaLaptopCode } from 'react-icons/fa';
import '../styles/Timeline.css';

function Timeline() {
    const experiences = [
        {
            date: 'CURRENT',
            title: 'Frontend Engineer',
            company: 'nura.construction',
            description: 'Built authentication systems and core components to enhance the visual side of real estate intelligence.',
            icon: <FaLaptopCode style={{ color: '#FFB800' }} />,
            color: 'rgba(255, 184, 0, 0.1)'
        },
        {
            date: 'AUG 2024 - DEC 2024',
            title: 'Retail Sales Advisor',
            company: 'Best Buy',
            description: 'Providing exceptional customer service skills by assisting customers with product inquiries and personalized recommendations.',
            icon: <FaStore style={{ color: '#64FFDA' }} />,
            color: 'rgba(100, 255, 218, 0.1)'
        },
        {
            date: '2022 - 2023',
            title: 'Full-Time Educator & Expeditor',
            company: 'Lululemon Athletica',
            description: 'Enhanced customer experiences, managed inventory, and streamlined checkout processes using various POS systems.',
            icon: <FaTshirt style={{ color: '#FF6B6B' }} />,
            color: 'rgba(255, 107, 107, 0.1)'
        },
        {
            date: '2020 - 2022',
            title: 'Server and Expeditor',
            company: 'Maynard\'s Restaurant',
            description: 'Orchestrated dine-in and takeout orders, optimized table turnover, and maximized revenue through strategic upselling.',
            icon: <FaUtensils style={{ color: '#7F7FD5' }} />,
            color: 'rgba(127, 127, 213, 0.1)'
        },
    ];

    return (
        <div className="timeline-container">
            <div className="timeline">
                {experiences.map((exp, index) => (
                    <motion.div
                        className="timeline-item"
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.3 }}
                    >
                        <div className="timeline-icon" style={{ backgroundColor: exp.color }}>
                            {exp.icon}
                        </div>
                        <div className="timeline-content">
                            <div className="timeline-date">{exp.date}</div>
                            <h3 className="timeline-title">{exp.title}</h3>
                            <div className="timeline-company">{exp.company}</div>
                            <p className="timeline-description">{exp.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default Timeline;