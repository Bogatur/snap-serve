import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './login&signup.css';
import Header from '../../components/header/Header';


const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      navigate('/createmenu'); // Giriş başarılıysa ana sayfaya yönlendir
    } catch (error) {
      alert("Hata: " + error.message);
    }
  };

  return (
    <>
    <Header />
    <div className='form-body'>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='form-button' type="submit">Login</button>
      </form>
    </div>
    </>
  );
};

export default LoginPage;
