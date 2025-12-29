import React from "react";
import { Navigate ,Outlet } from "react-router-dom";

//create callback function
const PrivateComponent=()=>{
    const auth = localStorage.getItem('user');
    return auth ?<Outlet />:<Navigate to="/login"/>
}

export default PrivateComponent;