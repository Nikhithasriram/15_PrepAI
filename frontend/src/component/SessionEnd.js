import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SessionEnd = () => {
  const navigate = useNavigate();

  const handleViewScore = () => {
    navigate('/score'); // Navigate to the score page (you can replace this with the actual score page route)
  };

  return (
    <div className="session-end-container">
      <h1>It was nice talking to you!</h1>
      <p>Unfortunately, the time is up. Please click here to check your score.</p>
      <button className="view-score-btn" onClick={handleViewScore}>
        View Score
      </button>
    </div>
  );
};

export default SessionEnd;