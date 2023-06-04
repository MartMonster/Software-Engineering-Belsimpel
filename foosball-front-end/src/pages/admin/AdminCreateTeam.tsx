import React, { useCallback, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ownTeamsRoute } from "../player/OwnTeams";
import { makeTeam } from '../../components/endpoints/admin/Teams';

export const createTeamRoute: string = "CreateTeam"
export const AdminCreateTeam = () => {
    const navigate = useNavigate();
    const [teamName, setTeamName] = useState("");
    const [player1, setPlayer1] = useState("");
    const [player2, setPlayer2] = useState("");
    const [errorMessage, setErrorMessage] = useState("")
    
    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])

    const navigateToDashboard = () => {
        navigate('/admin');
    }
    
    const makeTeamLocal = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if(await makeTeam(teamName, player1, player2, setErrorMessage)) {
            navigateToDashboard()
        }
    }
    
    return (
        <div className="App">
            <h1>Make a new foosball team</h1>
            <form autoComplete="off" onSubmit={makeTeamLocal}>
                <label>
                    What will the name of the team be?
                    <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed" type="text" maxLength={255} placeholder="Team name" onChange={e => setTeamName(e.target.value)}/>
                </label>
                <label>
                    Username
                    <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed" type="text" maxLength={255} placeholder="Username" onChange={e => setPlayer1(e.target.value)}/>
                </label>
                <label>
                    Username
                    <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed" type="text" maxLength={255} placeholder="Username" onChange={e => setPlayer2(e.target.value)} />
                </label>
                {error()}
                <button type="submit" className='submitButton'>Create team</button>
            </form>
        </div>
    );
}
