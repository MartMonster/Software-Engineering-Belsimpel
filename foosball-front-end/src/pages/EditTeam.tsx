import React, { useCallback, useState } from 'react';
import { useNavigate, Link, useParams } from "react-router-dom";
import { editTeam } from '../components/axios';
import { ownTeamsRoute } from './OwnTeams';

export const editTeamRoute: string = "edit"
export const EditTeam = () => {
    const idPar = useParams();
    let id: number = 0;
    if (idPar) {
        id = idPar.id as unknown as number;
    }
    const navigate = useNavigate();
    const navigateToOwnGames = () => {
        navigate(ownTeamsRoute);
    }
    const [teamName, setTeamName] = useState('');
    const [errorMessage, setErrorMessage] = useState("")
    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])
    const saveTeam = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if (await editTeam(id, teamName, setErrorMessage)) {
            navigateToOwnGames()
        }
    }
    return (
        <div className="App">
            <h1>Edit your team</h1>
            <form autoComplete="off" onSubmit={saveTeam}>
                <label>
                    Your new team name:
                    <input required type="text" placeholder="Team name" onChange={e => setTeamName(e.target.value)} />
                </label>
                {error()}
                <button type="submit">Save team</button>
            </form>
            <Link to={ownTeamsRoute}>
                <button>Cancel</button>
            </Link>
        </div>
    );
}