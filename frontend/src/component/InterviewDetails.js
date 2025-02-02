import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const InterviewDetails = () => {
  const [domain, setDomain] = useState('');
  const [level, setLevel] = useState('');
  const [time, setTime] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Selected Domain:', domain);
    console.log('Selected Level:', level);
    console.log('Selected Time:', time);
    navigate('/practice-prerequisite', { state: { time } }); // Pass selected time
  };

  return (
    <div className="interview-details-container">
      <h1>Interview Details</h1>
      <form onSubmit={handleSubmit}>
        {/* Domain Dropdown */}
        <div className="form-group">
          <label>Domain</label>
          <select value={domain} onChange={(e) => setDomain(e.target.value)} required>
            <option value="">Select Domain</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
          </select>
        </div>

        {/* Level Dropdown */}
        <div className="form-group">
          <label>Level</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)} required>
            <option value="">Select Level</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Time Selection */}
        <div className="form-group">
          <label>Time</label>
          <div className="time-options">
            <label>
              <input
                type="radio"
                value="30Mins"
                checked={time === '30Mins'}
                onChange={(e) => setTime(e.target.value)}
                required
              />
              30 Mins
            </label>
            <label>
              <input
                type="radio"
                value="45Mins"
                checked={time === '45Mins'}
                onChange={(e) => setTime(e.target.value)}
              />
              45 Mins
            </label>
            <label>
              <input
                type="radio"
                value="1Hr"
                checked={time === '1Hr'}
                onChange={(e) => setTime(e.target.value)}
              />
              1 Hr
            </label>
            <label>
              <input
                type="radio"
                value="5Mins"
                checked={time === '5Mins'}
                onChange={(e) => setTime(e.target.value)}
              />
              5 Mins
            </label>
          </div>
        </div>

        {/* Start Interview Button */}
        <button type="submit" className="start-interview-btn">
          Start Interview
        </button>
      </form>
    </div>
  );
};

export default InterviewDetails;