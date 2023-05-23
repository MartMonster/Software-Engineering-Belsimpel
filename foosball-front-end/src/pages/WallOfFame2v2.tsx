import React, { useState, useEffect, useCallback } from 'react';
import { getTop10Teams, Team } from '../components/axios';

export const wallOfFame2v2Route: string = "WallOfFame2v2"
export const WallOfFame2v2 = () => {
    const [teams, setTeams] = useState(new Array<Team>());
    const [errorMessage, setErrorMessage] = useState("")
    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])
    useEffect(() => {
        getTop10Teams(setErrorMessage).then((data) => {
            setTeams(data);
            console.log(data);
        });
    }, []);
    return (
        <div className="App">
            <h1>Wall of fame 2v2</h1>
            {error()}
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Team name</th>
                        <th>Players</th>
                        <th>Elo</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team: Team, index) => {
                        return (
                            <tr key={team.id}>
                                <td>{index+1}</td>
                                <td className='teamName'>{team.team_name}</td>
                                <td>
                                    <div className="tableCol">
                                        <p className='WoF2v2'>{team.player1_username}</p>
                                        <p className='WoF2v2'>{team.player2_username}</p>
                                    </div>
                                </td>
                                <td>{Math.round(team.elo)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}
