import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { editPlayer } from '../../components/endpoints/admin/Users';
import { wallOfFame1v1Route } from '../player/WallOfFame1v1';

export const AdminEditUser = () => {
    const idPar = useParams();
    const [searchParams] = useSearchParams();
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate();

    let id: number = 0;
    if (idPar) {
        id = idPar.id as unknown as number;
    }

    const navigateToWoF1v1 = () => {
        navigate('/admin/' + wallOfFame1v1Route);
    }

    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])

    const submitUsername = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (await editPlayer(id, username, setErrorMessage)) {
            navigateToWoF1v1();
        }
    }

    useEffect(() => {
        if (searchParams.get("username") as string) {
            setUsername(searchParams.get("username") as string);
        }
    },[searchParams])
    
    return (
        <div className="App">
            <h1>Edit a player</h1>
            <form autoComplete="off" onSubmit={submitUsername}>
                <div className="login">
                    <label>Username
                        <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed" type="text" maxLength={255} placeholder="Username" defaultValue={username} onChange={e => setUsername(e.target.value)}/>
                    </label>
                    {error()}
                    <button type="submit" className='submitButton'>Edit player</button>
                    <button type="button" onClick={navigateToWoF1v1}>Cancel</button>
                </div>
            </form>
        </div>
    )
}