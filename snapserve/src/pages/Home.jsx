import React from "react";
import { useAuth } from '../context/AuthContext';


function Home (){
    const { user, logout } = useAuth();
    console.log(user ? user.displayName : "empty")


    return (
        <div>
            <p>Home</p>
            <h5 className="username">{user ? user.displayName: "empty"}</h5>

        </div>
    )
}

export default Home