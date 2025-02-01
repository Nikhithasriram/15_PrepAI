import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/Signup';
import SignIn from './components/Signin'; // Create this component if needed
=======
import Home from './component/home'; // Update this line
>>>>>>> 537e5c7895554ddb6d10ee6952ffe2cbea70653a
import './App.css';

function App() {
  return (
<<<<<<< HEAD
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Home />} /> Add a Home component if needed
      </Routes>
    </Router>
=======
    <div className="App">
      <Home /> {/* Use the correct component name here */}
    </div>
>>>>>>> 537e5c7895554ddb6d10ee6952ffe2cbea70653a
  );
}

export default App;