import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editPlayer } from '../../components/admin/Users';
import { wallOfFame1v1Route } from '../WallOfFame1v1';

export const AdminEditUser = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const navigateToWoF1v1 = () => {
        navigate('/admin/' + wallOfFame1v1Route);
    }
    const idPar = useParams();
    let id: number = 0;
    if (idPar) {
        id = idPar.id as unknown as number;
    }
    const submitUsername = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (await editPlayer(id, username)) {
            navigateToWoF1v1();
        }
    }
    return (
        <div className="App">
            <h1>Edit a player</h1>
            <form autoComplete="off" onSubmit={submitUsername}>
                <div className="login">
                    <label>Username
                        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)}/>
                    </label>
                    <button type="submit">Edit player</button>
                    <button type="button" onClick={navigateToWoF1v1}>Cancel</button>
                </div>
            </form>
        </div>
    )
}