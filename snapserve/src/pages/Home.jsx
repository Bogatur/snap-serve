import React from "react";
import { useAuth } from '../context/AuthContext';
import './Home.css';
import { useNavigate, Link } from 'react-router-dom';


function Home (){
    const { user, logout } = useAuth();
    console.log(user ? user.displayName : "empty")
    const navigate = useNavigate();
    
    return (
        <div className="hero">
            <h1>Empowering Small <span className="green-text">Cafes&Restuarants</span> with Smart, Simple, and Seamless Service.</h1>
            <Link className="button-37" to="/login">GET STARTED</Link>
        </div> 
    )
}

export default Home