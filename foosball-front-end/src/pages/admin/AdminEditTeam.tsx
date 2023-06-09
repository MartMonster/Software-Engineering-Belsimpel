import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';
import {wallOfFame2v2Route} from '../player/WallOfFame2v2';
import {editTeam} from '../../components/endpoints/admin/Teams';

export const AdminEditTeam = () => {
    const idPar = useParams();
    const [teamName, setTeamName] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("")

    let id: number = 0;
    if (idPar) {
        id = idPar.id as unknown as number;
    }

    const navigateToWoF2v2 = () => {
        navigate('/admin/' + wallOfFame2v2Route);
    }

    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])

    const submitTeamName = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (searchParams.get("team") as string === teamName) {
            setErrorMessage('Team already has this name.');
            return;
        }
        if (await editTeam(id, teamName, setErrorMessage)) {
            navigateToWoF2v2();
        }
    }

    useEffect(() => {
        if (searchParams.get("team") as string) {
            setTeamName(searchParams.get("team") as string);
        }
    }, [searchParams])

    return (
        <div className="App">
            <h1>Edit a team</h1>
            <form autoComplete="off" onSubmit={submitTeamName}>
                <div className="login">
                    <label>Team name
                        <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                               type="text" maxLength={255} placeholder="Team name" defaultValue={teamName}
                               onChange={e => setTeamName(e.target.value)}/>
                    </label>
                    {error()}
                    <button type="submit" className='submitButton'>Edit team</button>
                    <button type="button" onClick={navigateToWoF2v2}>Cancel</button>
                </div>
            </form>
        </div>
    )
}