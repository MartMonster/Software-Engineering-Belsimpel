import React from 'react';
import { Outlet, Link, Navigate } from "react-router-dom";
import { loginRoute } from "./Login";
import { logout } from '../components/endpoints/player/Login';

// TODO: change this back to false
const DEBUG:boolean = false;

export const navbarRoute:string = "/"
export const Navbar = () => {
    let loggedIn = sessionStorage.getItem("loggedIn") === "true";
    let isAdmin = sessionStorage.getItem("isAdmin") === "true";
    if (!loggedIn && !DEBUG) {
        console.log("user not logged in!")
        return <Navigate to="/login"/>;
    }
    if (isAdmin) {
        console.log("user is admin!")
        return <Navigate to="/admin"/>;
    }
    return (
        <div className="App-header">
            <nav>
                <div className="row">
                    <div className="left">
                        <Link className='App-link' to="/">Dashboard</Link>
                    </div>
                    <div className="right">
                        <Link className='App-link' to={loginRoute} onClick={logout}>Logout</Link>
                    </div>
                </div>
            </nav>
            <hr/>
            <Outlet />
        </div>
    );
};