import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { editUsername } from '../components/axios';

export const editUsernameRoute = 'username';
export const EditUsername = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const navigateToDashboard = () => {
        navigate('/');
    }
    const submitUsername = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (await editUsername(username)) {
            navigateToDashboard();
        }
    }
    return (
        <div className="App">
            <h1>Edit your username</h1>
            <form autoComplete="off" onSubmit={submitUsername}>
                <div className="login">
                    <label>Username
                        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
                    </label>
                    <button type="submit">Edit username</button>
                    <button type="button" onClick={navigateToDashboard}>Cancel</button>
                </div>
            </form>
        </div>
    )
}