import React, {useCallback, useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {loginRoute} from "./Login";
import {register} from '../components/endpoints/Login';

export const registerRoute: string = '/register';
export const Register = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate();

    const navigateToDashboard = useCallback(() => {
        navigate("/");
    }, [navigate])

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (await register(email, username, firstName, lastName, password, confirmPassword, setErrorMessage)) {
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
                        <input required autoComplete='off' pattern="\S(.*\S)?"
                               title="Leading and trailing whitespaces are not allowed" type="text" maxLength={255}
                               placeholder="Username" onChange={e => setUsername(e.target.value)}/>
                        <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                               type="text" maxLength={255} placeholder="First name"
                               onChange={e => setFirstName(e.target.value)}/>
                        <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                               type="text" maxLength={255} placeholder="Last name"
                               onChange={e => setLastName(e.target.value)}/>
                        <input required type="password" placeholder="Password"
                               onChange={e => setPassword(e.target.value)}/>
                        <input required type="password" placeholder="Confirm password"
                               onChange={e => setConfirmPassword(e.target.value)}/>
                        {error()}
                        <button type="submit" className='submitButton'>Register</button>
                    </div>
                </form>
                <p>Already have an account? <Link className="App-link" to={loginRoute}>Login</Link> here!</p>
            </div>
        </div>
    );
}