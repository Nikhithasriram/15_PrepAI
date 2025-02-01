import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const PracticePrerequisite = () => {
  const [browserCompatibility, setBrowserCompatibility] = useState('Checking...');
  const [microphoneStatus, setMicrophoneStatus] = useState('Checking...');
  const [voiceQuality, setVoiceQuality] = useState('Checking...');
  const navigate = useNavigate();

  // Check browser compatibility
  useEffect(() => {
    checkBrowserCompatibility();
    checkMicrophone();
  }, []);

  const checkBrowserCompatibility = () => {
    const isChrome = navigator.userAgent.includes('Chrome');
    if (isChrome) {
      setBrowserCompatibility('Check completed. Your browser is compatible.');
    } else {
      setBrowserCompatibility('Check completed. Your browser is not compatible.');
    }
  };

  const checkMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophoneStatus('Microphone is enabled.');
      checkVoiceQuality(stream);
    } catch (error) {
      setMicrophoneStatus('Microphone access denied. Please check browser/device permissions.');
    }
  };

  const checkVoiceQuality = (stream) => {
    // Simulate voice quality check (replace with actual logic if needed)
    setTimeout(() => {
      setVoiceQuality('Voice quality is Good.');
    }, 2000);
  };

  const handleStartPractice = () => {
    navigate('/practice'); // Navigate to the practice page (you can replace this with the actual practice page route)
  };

  return (
    <div className="prerequisite-container">
      <h1>Practice Prerequisite</h1>
      <div className="compatibility-test">
        <p>Compatibility Test</p>
        <ul>
          <li>{browserCompatibility}</li>
          <li>Test completed. {microphoneStatus}</li>
          <li>Unable to access camera, please check browser/device permission for camera access.</li>
          <li>Voice quality: {voiceQuality}</li>
        </ul>
      </div>
      <button
        className="start-practice-btn"
        onClick={handleStartPractice}
        disabled={microphoneStatus !== 'Microphone is enabled.' || browserCompatibility.includes('not compatible')}
      >
        Start Practice
      </button>
    </div>
  );
};

export default PracticePrerequisite;