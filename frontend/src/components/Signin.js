import React, { useState } from 'react';
import './Signin.css';
import axios from "axios";

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

    const signin = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/users/login",{
                email,password
            }).then((res)=>{
                console.log(res)
            }).catch((res)=>{
                console.log(res)
            });
            console.log("Data received:", response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
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
                <button type="submit" onClick={signin}>SIGN IN</button>
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