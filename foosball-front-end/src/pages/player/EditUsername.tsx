import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {editUsername} from '../../components/endpoints/player/Users';

export const editUsernameRoute = 'username';
export const EditUsername = () => {
    const [searchParams] = useSearchParams();
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("")

    const navigateToDashboard = () => {
        navigate('/');
    }

    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])

    const submitUsername = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (username !== sessionStorage.getItem("username") as string) {
            if (await editUsername(username, setErrorMessage)) {
                navigateToDashboard();
            }
        } else {
            setErrorMessage("You already have this username.");
        }
    }

    useEffect(() => {
        if (searchParams.get("username") as string) {
            setUsername(searchParams.get("username") as string);
        }
    }, [searchParams])

    return (
        <div className="App">
            <h1>Edit your username</h1>
            <form autoComplete="off" onSubmit={submitUsername}>
                <div className="login">
                    <label>Username
                        <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                               type="text" maxLength={255} placeholder="Username" defaultValue={username}
                               onChange={e => setUsername(e.target.value)}/>
                    </label>
                    {error()}
                    <button type="submit" className='submitButton'>Edit username</button>
                    <button type="button" onClick={navigateToDashboard}>Cancel</button>
                </div>
            </form>
        </div>
    )
}