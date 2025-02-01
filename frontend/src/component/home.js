import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';


// Ensure you import the CSS file

const Home = () => {
  const navigate = useNavigate();
  const handleStartPractice = () => {
    navigate('/interview-details'); // Navigate to Interview Details page
  };
  const handlesignup = () => {
    navigate('/Signup');
  };

  const handlesignin = () => {
    navigate('/Signin');
  };

  return (
    <div className="prepai-container">
      {/* Green Header */}
      <header className="header">
        <h1 className="header-title">Prep AI</h1>
        <div className="header-buttons">
          <button className="sign-in-btn" onClick={handlesignup}>Sign Up</button>
          <button className="login-btn" onClick={handlesignin}>Login</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h2>Prepare. Practice. Succeed.</h2>
        <p>Your perfect interview starts here!</p>
        <button className="start-practice-btn" onClick={handleStartPractice}>
          Start practice
        </button>
      </main>

      {/* Benefits Section */}
      <section className="benefits-section">
        <h3>PrepAI Benefits</h3>
        <div className="benefits-grid">
          <div className="benefit">
            <h4>Ultimate Interview Mastery</h4>
            <p>Practice with countless role-specific mock questions tailored to your dream job, covering multiple interview rounds with personalized expert feedback.</p>
          </div>
          <div className="benefit">
            <h4>Company-Specific Practices</h4>
            <p>Practice based on the job description for any role in the company to improve your skills in articulation, communication, and domain knowledge.</p>
          </div>
          <div className="benefit">
            <h4>Actionable Analytics</h4>
            <p>In-depth analytics that evaluate multiple factors, providing comprehensive insights into your interview performance, helping you improve across key areas.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h3>How it works</h3>
        <ol>
          <li>Select your desired role and other interview details to start practicing.</li>
          <li>Practice with live audio follow-up questions.</li>
          <li>Get actionable feedback based on industry evaluation parameters.</li>
          <li>Track and improve your performance through unlimited practices.</li>
        </ol>
      </section>
    </div>
  );
};

export default Home;