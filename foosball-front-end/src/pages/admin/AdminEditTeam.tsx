import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { wallOfFame2v2Route } from '../WallOfFame2v2';
import { editTeam } from '../../components/admin/Teams';

export const AdminEditTeam = () => {
    const [teamName, setTeamName] = useState("");
    const navigate = useNavigate();
    const navigateToWoF2v2 = () => {
        navigate('/admin/' + wallOfFame2v2Route);
    }
    const idPar = useParams();
    let id: number = 0;
    if (idPar) {
        id = idPar.id as unknown as number;
    }
    const [errorMessage, setErrorMessage] = useState("")
    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])
    const submitTeamName = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (await editTeam(id, teamName, setErrorMessage)) {
            navigateToWoF2v2();
        }
    }
    return (
        <div className="App">
            <h1>Edit a team</h1>
            <form autoComplete="off" onSubmit={submitTeamName}>
                <div className="login">
                    <label>Team name
                        <input required type="text" placeholder="Team name" onChange={e => setTeamName(e.target.value)} />
                    </label>
                    {error()}
                    <button type="submit">Edit team</button>
                    <button type="button" onClick={navigateToWoF2v2}>Cancel</button>
                </div>
            </form>
        </div>
    )
}