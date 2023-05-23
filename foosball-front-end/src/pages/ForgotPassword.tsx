import React, { useCallback, useState } from 'react';
import { forgotPassword } from '../components/axios';
import { Link, useNavigate } from 'react-router-dom';
import { loginRoute } from './Login';
const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const navigateToDashboard = () => {
        navigate("/");
    }
    const [errorMessage, setErrorMessage] = useState("")
    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])
    const sendResetEmail = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (await forgotPassword(email, setErrorMessage)) {
            navigateToDashboard();
        }
    }
    return (
        <div className="App-header">
            <div className="App">
                <h1>Forgot password</h1>
                <form autoComplete="off" onSubmit={sendResetEmail}>
                    <div className="login">
                        <label>Email
                            <input type="text" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                        </label>
                        {error()}
                        <input type="submit" value="Send reset email" />
                    </div>
                </form>
                <p>Back to the <Link className='App-link' to={loginRoute}>Login page.</Link></p>
            </div>
        </div>
    );
}

export default ForgotPassword;