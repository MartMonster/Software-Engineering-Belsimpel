import React, { useCallback, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../components/endpoints/Login';

const PasswordReset = () => {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const [hash] = useState(params.hash as string);
    const [email] = useState(searchParams.get("email") as string);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])
    
    const navigateToDashboard = () => {
        navigate("/");
    }

    const sendResetCall = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (await resetPassword(email, password, confirmPassword, hash, setErrorMessage)) {
            navigateToDashboard();
        }
    }
    
    return (
        <div className="App-header">
            <div className='App'>
                <h1 className='title'>Reset password</h1>
                <form onSubmit={sendResetCall}>
                    <div className="login">
                        <label>Email
                            <input required type="text" maxLength={255} value={email} disabled/>
                        </label>
                        <label>New password
                            <input required type="password" placeholder="New password" onChange={e => setPassword(e.target.value)} />
                        </label>
                        <label>Confirm password
                            <input required type="password" placeholder="Confirm password" onChange={e => setConfirmPassword(e.target.value)} />
                        </label>
                        {error()}
                        <button type="submit" className='submitButton'>Reset password</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PasswordReset;