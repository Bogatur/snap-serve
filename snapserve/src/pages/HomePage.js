import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login'); // Login sayfasına yönlendir
  };

  const handleSignupRedirect = () => {
    navigate('/signup'); // Login sayfasına yönlendir
  };
  
  return (
    <div>
        <h1>Home Page</h1>
        <h2>User: {user ? user.email : 'Guest'}!</h2>
        <h2>{user ? user.displayName : ""}</h2>
        <button onClick={logout}>Logout</button>
        <button onClick={handleLoginRedirect}>Go to Login</button>
        <button onClick={handleSignupRedirect}>Go to Signup</button>
    </div>
  );
};

export default HomePage;
