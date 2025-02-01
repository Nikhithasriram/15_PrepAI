import React, { useState } from 'react';
import './Signin.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Add your login logic here
        console.log('Login with:', email, password);
    };

    const handleGoogleLogin = () => {
        // Add your Google login logic here
        console.log('Login with Google');
    };

    return (
        <div className="login-container">
            <h2>Sign In</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">SIGN IN</button>
            </form>
            <button className="google-login" onClick={handleGoogleLogin}>
                LOGIN WITH GOOGLE
            </button>
            <p><a href="#">Forgot Password</a></p>
            <p>Don't have an account? <a href="#">Sign up</a></p>
        </div>
    );
};

export default Login;