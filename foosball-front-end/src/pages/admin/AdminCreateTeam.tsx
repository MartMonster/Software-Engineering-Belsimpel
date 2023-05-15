import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ownTeamsRoute } from "../OwnTeams";
import { makeTeam } from '../../components/admin/Teams';

export const createTeamRoute: string = "CreateTeam"
export const AdminCreateTeam = () => {
    const navigate = useNavigate();
    const navigateToOwnTeams = () => {
        navigate(ownTeamsRoute);
    }
    const [teamName, setTeamName] = useState("");
    const [player1, setPlayer1] = useState("");
    const [player2, setPlayer2] = useState("");
    const makeTeamLocal = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if(await makeTeam(teamName, player1, player2)) {
            navigateToOwnTeams()
        }
    }
    return (
        <div className="App">
            <h1>Make a new foosball team</h1>
            <form autoComplete="off" onSubmit={makeTeamLocal}>
                <label>
                    What will the name of the team be?
                    <input type="text" placeholder="Team name" onChange={e => setTeamName(e.target.value)}/>
                </label>
                <label>
                    Username
                    <input type="text" placeholder="Username" onChange={e => setPlayer1(e.target.value)}/>
                </label>
                <label>
                    Username
                    <input type="text" placeholder="Username" onChange={e => setPlayer2(e.target.value)} />
                </label>
                <button type="submit">Create team</button>
            </form>
        </div>
    );
}
