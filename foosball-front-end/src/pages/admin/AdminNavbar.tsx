import React from 'react';
import {Link, Navigate, Outlet} from "react-router-dom";
import {loginRoute} from "../Login";
import {logout} from '../../components/endpoints/Login';

const DEBUG: boolean = false;

export const navbarRoute: string = "/"
export const AdminNavbar = () => {
    let loggedIn = sessionStorage.getItem("loggedIn") === "true";
    let isAdmin = sessionStorage.getItem("isAdmin") === "true";
    if (!loggedIn && !DEBUG) {
        return <Navigate to="/login"/>;
    }
    if (!isAdmin) {
        return <Navigate to="/"/>;
    }

    return (
        <div className="App-header">
            <nav>
                <div className="rowNav">
                    <div className="left">
                        <Link className='App-link' to="/admin">Dashboard</Link>
                    </div>
                    <div className="right">
                        <Link className='App-link' to={loginRoute} onClick={logout}>Logout</Link>
                    </div>
                </div>
            </nav>
            <Outlet/>
        </div>
    );
};