import React, { useState, useEffect } from 'react';
import { getTop10Teams, Team } from '../components/axios';

export const wallOfFame2v2Route: string = "WallOfFame2v2"
export const WallOfFame2v2 = () => {
    const [teams, setTeams] = useState(new Array<Team>());
    useEffect(() => {
        getTop10Teams().then((data) => {
            if (data !== undefined) {
                setTeams(data);
                console.log(data);
            }
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
                        <th>Username</th>
                        <th>Username</th>
                        <th>Elo</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team: Team, index) => {
                        return (
                            <tr key={team.id}>
                                <td>{index+1}</td>
                                <td>{team.team_name}</td>
                                <td>{team.player1_username}</td>
                                <td>{team.player2_username}</td>
                                <td>{team.elo}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}
