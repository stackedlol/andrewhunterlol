// components/SocialButtons.js
import React from 'react';

function SocialButtons() {
    return (
        <div className="social-buttons-container">
            <div className="social-buttons">
                <a href="https://x.com/stackedlol" className="social-button twitter" target="_blank" rel="noopener noreferrer">
                    <span className="iconify" data-icon="simple-icons:x"></span>
                </a>
                <a href="https://t.me/stackedx0" className="social-button telegram" target="_blank" rel="noopener noreferrer">
                    <span className="iconify" data-icon="mdi:telegram"></span>
                </a>
                <a href="https://www.tiktok.com/@fullstackeddd" className="social-button tiktok" target="_blank" rel="noopener noreferrer">
                    <span className="iconify" data-icon="simple-icons:tiktok"></span>
                </a>
                <a href="https://instagram.com/andrewhunnter" className="social-button instagram" target="_blank" rel="noopener noreferrer">
                    <span className="iconify" data-icon="mdi:instagram"></span>
                </a>
                <a href="https://www.linkedin.com/in/andrew-hunter-1bab182b0" className="social-button linkedin" target="_blank" rel="noopener noreferrer">
                    <span className="iconify" data-icon="mdi:linkedin"></span>
                </a>
                <a href="https://github.com/stackedlol?tab=repositories" className="social-button github" target="_blank" rel="noopener noreferrer">
                    <span className="iconify" data-icon="mdi:github"></span>
                </a>
            </div>
        </div>
    );
}

export default SocialButtons;
