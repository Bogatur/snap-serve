import React, { useState } from "react";
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom';
import '../createMenuPage/CreateMenu.css';

function GenerateQr (){
    const { user, logout } = useAuth();
    console.log(user ? user.displayName : "empty")

    const navigate = useNavigate();
    const handleLoginRedirect = () => {
        logout();
        navigate('/login'); // Login sayfasına yönlendir
    };

    const handleSignupRedirect = () => {
        logout();
        navigate('/signup'); // Login sayfasına yönlendir
    };

    const handleLogoutRedirect = () => {
        logout();
        navigate('/login'); // Login sayfasına yönlendir
    };

    const [tables, setTables] = useState([]);
    const [tableCounter, setTableCounter] = useState(1);
  
    const addTable = () => {
      setTables([...tables, { id: tableCounter }]);
      setTableCounter(tableCounter + 1);
    };
  
    const deleteTable = (id) => {
      setTables(tables.filter(table => table.id !== id));
    };




    return (
      <div className="profile-page">
        <div className="profile-menu">
            <div className="user-info-container">
            <h3>PROFILE INFORMATION</h3>
            <div className="userinfo">
                <h4>XYZ Company</h4>
                <h5 className="username">{user ? user.displayName: "empty"}</h5>
                <img src="" alt="" />
            </div>
            </div>
            <div className="profile-navigation">
            <h5>GENERAL</h5>
            <button><Link to="/createmenü">Create Menü</Link></button>
            <button>Generate QR</button>
            <button>Order Tracking</button>
            <button>Statistics</button>
            <button onClick={handleLogoutRedirect}>Logout</button>
            <button onClick={handleLoginRedirect}>Go to Login</button>
            <button onClick={handleSignupRedirect}>Go to Signup</button>
            </div>
        </div>
        <div className="current-profile-page">
            <h5>Create Tables & QR Codes</h5>
            <hr />
            <div className="menu-container">
                <div className="menu-item-container">
                    <div className="menu-item add-item">
                    <button onClick={addTable}>Add Table</button>
                    <div>
                        {tables.map(table => (
                        <div key={table.id} style={{ border: '1px solid black', padding: '10px', margin: '10px', width: '200px' }}>
                            <p>Masa No: {table.id}</p>
                            <button disabled>Get QR Code</button>
                            <button onClick={() => deleteTable(table.id)}>Delete</button>
                        </div>
                        ))}
                    </div>
                </div>
                
            </div>

            </div>
        </div>
      </div>
    )
}

export default GenerateQr