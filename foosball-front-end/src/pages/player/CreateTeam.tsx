import React, {useCallback, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {ownTeamsRoute} from "./OwnTeams";
import {makeTeam} from '../../components/endpoints/player/Teams';

export const createTeamRoute: string = "CreateTeam"
export const CreateTeam = () => {
    const navigate = useNavigate();
    const [teamName, setTeamName] = useState("");
    const [teammate, setTeammate] = useState("");
    const [errorMessage, setErrorMessage] = useState("")

    const navigateToOwnTeams = () => {
        navigate(ownTeamsRoute);
    }

    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])

    const makeTeamLocal = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if (await makeTeam(teamName, teammate, setErrorMessage)) {
            navigateToOwnTeams()
        }
    }

    return (
        <div className="App">
            <h1>Make a new foosball team</h1>
            <form autoComplete="off" onSubmit={makeTeamLocal}>
                <label>
                    What will the name of your team be?
                    <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                           type="text" maxLength={255} placeholder="Team name"
                           onChange={e => setTeamName(e.target.value)}/>
                </label>
                <label>
                    What is the username of your teammate?
                    <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                           type="text" maxLength={255} placeholder="Username"
                           onChange={e => setTeammate(e.target.value)}/>
                </label>
                {error()}
                <button type="submit" className='submitButton'>Create team</button>
            </form>
        </div>
    );
}
