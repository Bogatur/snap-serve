import React from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'
import './SideMenu.css';
// import {getCompanyData } from "../../services/companyService";


function SideMenu (){
    const { user, username, companyKey, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogoutRedirect = () => {
        logout();
        navigate('/login'); // Login sayfasına yönlendir
      };
    
    return (
        <div className="profile-menu">
                <div className="user-info-container">
                <h3>PROFILE INFORMATION</h3>
                <div className="userinfo">
                    <h5 className="username">{username ? username: "empty"}</h5>
                    <h5>Company Name</h5>
                    <img src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png" alt="pp" />
                </div>
                </div>
                <div className="profile-navigation">
                <h5>GENERAL</h5>
                <Link to="/createmenu"><button className="create-menu-button">Create Menu</button></Link>
                <Link to="/generateqr"><button>Generate QR</button></Link>
                <Link to="/ordertracking"><button>Order Tracking</button></Link>
                <Link to="/statistics"><button>Statistics</button></Link>
                <button onClick={handleLogoutRedirect}>Logout</button>
                </div>
        </div>
    )
}

export default SideMenu
