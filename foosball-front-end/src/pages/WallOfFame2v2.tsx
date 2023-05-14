import React, { useState, useEffect } from 'react';
import { getTop10Teams, Team } from '../components/axios';

export const wallOfFame2v2Route: string = "WallOfFame2v2"
export const WallOfFame2v2 = () => {
    const [teams, setTeams] = useState(new Array<Team>());
    useEffect(() => {
        getTop10Teams().then((data) => {
            setTeams(data);
            console.log(data);
        });
    }, []);
    return (
        <div className="App">
            <h1>Wall of fame 2v2</h1>
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
                                <td>{team.team_name}</td>
                                <td>
                                    <div className="tableCol">
                                        <p>{team.player1_username}</p>
                                        <p>{team.player2_username}</p>
                                    </div>
                                </td>
                                <td>{team.elo}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}
