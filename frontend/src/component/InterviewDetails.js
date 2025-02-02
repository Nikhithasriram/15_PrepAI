import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const InterviewDetails = () => {
  const [domain, setDomain] = useState('');
  const [level, setLevel] = useState('');
  const [time, setTime] = useState('');
  const [question, setQuestion] = useState(''); // State to hold generated question
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Selected Domain:', domain);
    console.log('Selected Level:', level);
    console.log('Selected Time:', time);

    // Prepare the data to send to the backend
    const data = { domain, level, time };

    try {
      // Send the data to the Flask backend via the API endpoint
      const response = await fetch('https://cd35-34-68-198-139.ngrok-free.app/generate_question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Received Question:', result.question);
        setQuestion(result.question); // Set the generated question in the state

        // Optionally, navigate to a new page or display the question
        navigate('/practice-prerequisite'); // Navigate to Practice Prerequisite page
      } else {
        console.error('Error generating question:', response.statusText);
      }
    } catch (error) {
      console.error('Error during API call:', error);
    }
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

      {/* Display the generated question */}
      {question && (
        <div className="generated-question">
          <h2>Generated Question:</h2>
          <p>{question}</p>
        </div>
      )}
    </div>
  );
};

export default InterviewDetails;
