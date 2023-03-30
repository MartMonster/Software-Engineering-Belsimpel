import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { registerRoute } from "./Register";
import { login, logout } from '../components/axios';

export const loginRoute:string = '/login';
export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const navigateToDashboard = () => {
        navigate("/");
    }

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (await login(email, password)) {
            navigateToDashboard();
        }
    }
    return (
        <div className="App-header">
            <div className="App">
                <h1>Welcome to the foosball tracking website!</h1>
                <form onSubmit={handleSubmit}>
                    <div className="login">
                        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                        <button type='submit'>Login</button>
                    </div>
                </form>
                <button onClick={logout}>Logout</button>
                <Link className="App-link" to={registerRoute}>Register</Link>
            </div>
        </div>
    );
}