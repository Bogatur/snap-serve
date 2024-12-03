import React from "react";
import {Link} from 'react-router-dom'

import './Header.css';

function Header (){

    return (
        <div className="nav-bar">
            <Link to="/"><h1>SNAPSERVE</h1></Link>
            <div className="pages">
                <Link to="/login">Login</Link>
                <Link to="/signup">SignUp</Link>
            </div>
        </div>
    )
}

export default Header