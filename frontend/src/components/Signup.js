import React, { useState } from 'react';
import './Signup.css'; // Import your CSS file

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  
  const signup = async () => {
    try {
        const response = await axios.post("http://localhost:3000/api/users/register",{
            firstname,email,password
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="signup-container">
      <h2 className="signup_word">Sign Up</h2>
      <button className="google-btn">LOGIN WITH GOOGLE</button>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="signup-btn" onClick={signup}>SIGN UP</button>
      </form>
      <p>Already have an account? <a href="/signin">Sign In</a></p>
    </div>
  );
};

export default SignUp;