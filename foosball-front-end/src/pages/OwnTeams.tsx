import React, { useState, useEffect } from 'react';
import { getOwnTeams, Team } from '../components/axios';

export const ownTeamsRoute: string = "self";
export const OwnTeams = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    useEffect(() => {
        getOwnTeams().then(teams => {
            if (teams) {
                setTeams(teams);
            }
        });
    }, []);
    return (
        <div className="App">
            <h1>Your teams</h1>
            <table>
                <thead>
                    <tr>
                        {/* <th>#</th> */}
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
                                {/* <td>{index + 1}</td> */}
                                <td>{team.team_name}</td>
                                <td>{team.player1_username}</td>
                                <td>{team.player2_username}</td>
                                <td>{team.elo}</td>
                            </tr>
                        );
                    })
                    }
                </tbody>
            </table>
        </div>
    );
}
