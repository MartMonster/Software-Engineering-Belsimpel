import React from 'react';
import { Outlet, Link, Navigate } from "react-router-dom";
import { loginRoute } from "./Login";
import { logout, loggedIn } from '../components/axios';

const DEBUG:boolean = false;

export const navbarRoute:string = "/"
export const Navbar = () => {
    if (!loggedIn && !DEBUG) {
        console.log("user not logged in!")
        return <Navigate to="login"/>;
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