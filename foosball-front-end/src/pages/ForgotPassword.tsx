import React, { useCallback, useState } from 'react';
import { forgotPassword } from '../components/endpoints/Login';
import { Link, useNavigate } from 'react-router-dom';
import { loginRoute } from './Login';
const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("")

    const navigateToDashboard = () => {
        navigate("/");
    }
    
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
                <h1 className='title'>Forgot password</h1>
                <form onSubmit={sendResetEmail}>
                    <div className="login">
                        <label>Email
                            <input required type="email" maxLength={255} placeholder="Email" onChange={e => setEmail(e.target.value)} />
                        </label>
                        {error()}
                        <button type="submit" className='submitButton'>Send reset email</button>
                    </div>
                </form>
                <p>Back to the <Link className='App-link' to={loginRoute}>Login page.</Link></p>
            </div>
        </div>
    );
}

export default ForgotPassword;