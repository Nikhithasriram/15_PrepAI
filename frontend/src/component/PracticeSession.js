import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

const PracticeSession = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [chat, setChat] = useState([{ sender: 'system', message: 'Hello!' }]);
  const [timeRemaining, setTimeRemaining] = useState(0); // Timer state
  const [timerStarted, setTimerStarted] = useState(false); // Track if the timer has started
  const [showQuitPopup, setShowQuitPopup] = useState(false); // State for quit pop-up
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const location = useLocation();
  const navigate = useNavigate();

  // Get selected time from PracticePrerequisite page
  const selectedTime = location.state?.time || '30Mins'; // Default to 30Mins if no time is passed

  // Convert selected time to seconds
  useEffect(() => {
    let timeInSeconds;
    switch (selectedTime) {
      case '30Mins':
        timeInSeconds = 30 * 60;
        break;
      case '45Mins':
        timeInSeconds = 45 * 60;
        break;
      case '1Hr':
        timeInSeconds = 60 * 60;
        break;
      case '5Mins':
        timeInSeconds = 5 * 60;
        break;
      default:
        timeInSeconds = 30 * 60; // Default to 30 minutes
    }
    setTimeRemaining(timeInSeconds);
    setTimerStarted(true); // Start the timer
  }, [selectedTime]);

  // Timer logic
  useEffect(() => {
    if (timerStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);

      // Clear interval when time reaches 0
      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && timerStarted) {
      navigate('/session-end'); // Redirect to SessionEnd page when time is up
    }
  }, [timeRemaining, timerStarted, navigate]);

  // Display reminder when 2 minutes are left
  useEffect(() => {
    if (timeRemaining === 120) {
      setChat((prevChat) => [
        ...prevChat,
        { sender: 'system', message: 'Time is about to end!' },
      ]);
    }
  }, [timeRemaining]);

  // Handle user speech and system response
  useEffect(() => {
    if (transcript) {
      // Add user's speech to chat
      setChat((prevChat) => [...prevChat, { sender: 'user', message: transcript }]);

      // Generate system response
      const systemResponse = generateSystemResponse(transcript);
      setChat((prevChat) => [...prevChat, { sender: 'system', message: systemResponse }]);

      // Reset transcript for the next input
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  // Generate system response based on user input
  const generateSystemResponse = (userMessage) => {
    if (userMessage.toLowerCase().includes('hello')) {
      const name = userMessage.split(' ').pop(); // Extract the name from the message
      return `Nice to meet you, ${name}. Please introduce yourself.`;
    }
    return "I'm here to help you practice. What would you like to talk about?";
  };

  // Toggle microphone mute/unmute
  const toggleMicrophone = () => {
    if (isMuted) {
      SpeechRecognition.startListening();
    } else {
      SpeechRecognition.stopListening();
    }
    setIsMuted(!isMuted);
  };

  // Format time remaining (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Handle Quit Button Click
  const handleQuit = () => {
    setShowQuitPopup(true); // Show the quit confirmation pop-up
  };

  // Confirm Quit and Redirect to Home Page
  const confirmQuit = () => {
    navigate('/'); // Redirect to the Home Page
  };

  // Cancel Quit
  const cancelQuit = () => {
    setShowQuitPopup(false); // Hide the quit confirmation pop-up
  };

  return (
    <div className="practice-session-container">
      <h1>Practice Session</h1>
      <div className="timer">
        Time Remaining: {formatTime(timeRemaining)}
      </div>
      <div className="chat-container">
        {chat.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <strong>{msg.sender === 'system' ? 'System' : 'You'}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="microphone-control">
        <button onClick={toggleMicrophone} className="microphone-btn">
          {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
        <p>{listening ? 'Listening...' : 'Click the microphone to start speaking.'}</p>
      </div>

      {/* Quit Button */}
      <button className="quit-btn" onClick={handleQuit}>
        Quit
      </button>

      {/* Quit Confirmation Pop-up */}
      {showQuitPopup && (
        <div className="quit-popup">
          <div className="quit-popup-content">
            <p>You have clicked the Quit button. You will be redirected to the Home Page.</p>
            <div className="quit-popup-buttons">
              <button onClick={confirmQuit}>OK</button>
              <button onClick={cancelQuit}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeSession;