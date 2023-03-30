import React from 'react';
import { useNavigate } from "react-router-dom";
export const registerRoute: string = '/register';
export const Register = () => {
    const navigate = useNavigate();
    const navigateToDashboard = () => {
        navigate("/");
    }
    return (
        <div className="App-header">
            <div className="App">
                <h1>Welcome to the foosball tracking website!</h1>
                <form>
                    <div className="login">
                        <input type="email" placeholder="Email" />
                        <input type="text" placeholder="Username" />
                        <input type="text" placeholder="First name" />
                        <input type="text" placeholder="Last name" />
                        <input type="password" placeholder="Password" />
                        <button type="submit" onClick={navigateToDashboard}>Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
}