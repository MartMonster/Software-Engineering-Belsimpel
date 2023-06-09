import React, {useCallback, useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {registerRoute} from "./Register";
import {login} from '../components/endpoints/Login';

export const loginRoute: string = '/login';
export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate();

    const navigateToDashboard = useCallback(() => {
        navigate("/");
    }, [navigate])

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (await login(email, password, setErrorMessage)) {
            navigateToDashboard();
        }
    }

    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])

    useEffect(() => {
        if (window.sessionStorage.getItem('loggedIn') === 'true') {
            navigateToDashboard();
        }
    }, [navigateToDashboard]);

    return (
        <div className="App-header">
            <h1 className='title'>Welcome to the foosball tracking website!</h1>
            <div className="App">
                <form onSubmit={handleSubmit}>
                    <div className="login">
                        <input required type="email" placeholder="Email" onChange={e => setEmail(e.target.value)}/>
                        <input required type="password" placeholder="Password"
                               onChange={e => setPassword(e.target.value)}/>
                        {error()}
                        <button type="submit" className='submitButton'>Login</button>
                    </div>
                </form>
                <p>Forgot password? <Link className='App-link' to='/forgot-password'>Click here!</Link></p>
                <p>Don't have an account yet? <Link className="App-link" to={registerRoute}>Register</Link> here!</p>
            </div>
        </div>
    );
}