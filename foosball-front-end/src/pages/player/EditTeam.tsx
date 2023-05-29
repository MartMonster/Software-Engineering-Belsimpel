import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link, useParams, useSearchParams } from "react-router-dom";
import { editTeam } from '../../components/endpoints/player/Teams';
import { ownTeamsRoute } from './OwnTeams';

export const editTeamRoute: string = "edit"
export const EditTeam = () => {
    const idPar = useParams();
    const navigate = useNavigate();
    const [teamName, setTeamName] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [searchParams] = useSearchParams();

    let id: number = 0;
    if (idPar) {
        id = idPar.id as unknown as number;
    }
    
    const navigateToOwnGames = () => {
        navigate(ownTeamsRoute);
    }
    
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
    
    useEffect(() => {
        if (searchParams.get("team") as string) {
            setTeamName(searchParams.get("team") as string);
        }
    }, [searchParams])
    
    return (
        <div className="App">
            <h1>Edit your team</h1>
            <form autoComplete="off" onSubmit={saveTeam}>
                <label>
                    Your new team name:
                    <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed" type="text" maxLength={255} placeholder="Team name" defaultValue={teamName} onChange={e => setTeamName(e.target.value)} />
                </label>
                {error()}
                <button type="submit" className='submitButton'>Save team</button>
            </form>
            <Link to={ownTeamsRoute}>
                <button>Cancel</button>
            </Link>
        </div>
    );
}