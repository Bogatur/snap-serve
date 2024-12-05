import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/header/Header'

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Home from './pages/Home';
import CreateMenu from './pages/createMenuPage/CreateMenu';
import GenerateQr from './pages/generateQrPage/GenerateQr';

function App() {
  return (
    <AuthProvider>
      <Header /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/createmenü" element={<CreateMenu />} />
          <Route path="/generateqr" element={<GenerateQr />} />
        </Routes>
    </AuthProvider>
  );
}

export default App;
