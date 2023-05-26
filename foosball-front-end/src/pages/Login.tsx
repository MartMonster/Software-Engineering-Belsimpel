import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { registerRoute } from "./Register";
import { login } from '../components/endpoints/Login';

export const loginRoute:string = '/login';
export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate();
    const navigateToDashboard = () => {
        navigate("/");
    }

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (await login(email, password, setErrorMessage)) {
            navigateToDashboard();
        }
        console.log(errorMessage);
    }

    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    },[errorMessage])
    return (
        <div className="App-header">
            <div className="App">
                <h1 className='title'>Welcome to the foosball tracking website!</h1>
                <form onSubmit={handleSubmit}>
                    <div className="login">
                        <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                        <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
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