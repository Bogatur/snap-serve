import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [password, setPassword] = useState();
  const [rePassword, setRePassword] = useState();

  const [companyName, setCompanyName] = useState('company');

  const handleSignup = async () => {
    try {
      await signup(email, password, rePassword, firstName, lastName, companyName); 
      navigate('/login'); 
    } catch (err) {
        alert(err);
      }
  };


  return (
    <div>
      <h2>Signup</h2>
    
        <input
          type="text"
          placeholder="Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
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
          <input
          type="password"
          placeholder="RePassword"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
        />
            <button onClick={handleSignup}>Signup</button>

        <p>Company şu anlık işlevsiz!</p>
        <input
          type="text"
          placeholder="Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
   
    

    </div>
  );
};

export default SignupPage;
