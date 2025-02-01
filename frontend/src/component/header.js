import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Ensure you import the CSS file

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if the user is logged in based on the presence of the access token
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            setIsLoggedIn(true);  // User is logged in
        } else {
            setIsLoggedIn(false);  // User is not logged in
        }
    }, []);  // Empty dependency array to run once on component mount

    const navigate = useNavigate();

    const handlesignup = () => {
        navigate('/Signup');
    };

    const handlesignin = () => {
        navigate('/Signin');
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');  // Remove token from localStorage
        setIsLoggedIn(false);  // Update the state to reflect the logged-out status
        console.log("Logged out");
    };

    return (
        <header className="header">
            <h1 className="header-title">Prep AI</h1>
            <div className="header-buttons">
                {isLoggedIn ? (
                    <button className="logout" onClick={handleLogout}>Logout</button>
                ) : (
                    <>
                        <button className="sign-in-btn" onClick={handlesignup}>Sign Up</button>
                        <button className="login-btn" onClick={handlesignin}>Login</button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
