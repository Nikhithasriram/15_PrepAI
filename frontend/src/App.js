import React from 'react';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/Signup';
import SignIn from './components/Signin'; // Create this component if needed
import Home from './component/home'; // Update this line
import InterviewDetails from './component/InterviewDetails';
import PracticePrerequisite from './component/PracticePrerequisite';
import PracticeSession from './component/PracticeSession';
import SessionEnd from './component/SessionEnd';

import './App.css';

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/interview-details" element={<InterviewDetails />} />
        <Route path="/" element={<Home />} /> Add a Home component if needed
        <Route path="/practice-prerequisite" element={<PracticePrerequisite />} />
        <Route path="/practice" element={<PracticeSession />} />
        <Route path="/session-end" element={<SessionEnd />} /> {/* Add SessionEnd route */}
      </Routes>
    </Router>


  );
}

export default App;