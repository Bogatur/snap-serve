import React from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'

import './Header.css';

function Header (){
    const { user, username, companyKey, logout } = useAuth();
    // const navigate = useNavigate();

    // const handleLogoutRedirect = () => {
    //     logout();
    //     navigate('/login'); // Login sayfasına yönlendir
    //   };
    


    return (
        <div className="nav-bar">
            <Link to="/"><h1>SNAPSERVE</h1></Link>
            {!user ? (
            <div className="pages">
                <Link to="/login">Login</Link>
                <Link to="/signup">SignUp</Link>
            </div>
            ) : (
            <div className="pages">
                <p>Profile</p>
            </div>
            )}
        </div>
    )
}

export default Header

