import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navRef = useRef();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="logo">ah.</div>
            <nav ref={navRef}>
                <button 
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
                    aria-label="Toggle menu" 
                    onClick={toggleMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <li><Link to="/" className="nav-link" onClick={closeMenu}>home</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Navbar;