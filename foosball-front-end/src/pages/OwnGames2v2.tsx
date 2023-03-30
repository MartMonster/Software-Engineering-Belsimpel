import React, { useState, useEffect } from 'react';
import { getOwnGames2v2, Game2v2 } from '../components/axios';

export const ownGames2v2Route: string = "self";
export const OwnGames2v2 = () => {
    const [games, setGames] = useState<Game2v2[]>([]);
    useEffect(() => {
        getOwnGames2v2().then((data) => {
            if (data !== undefined) {
                setGames(data);
                console.log(data);
            }
        });
    }, []);
    return (
        <div className="App">
            <h1>Your last 10 2v2 games</h1>
            <table>
                <thead>
                    <tr>
                        <th>Team name Red</th>
                        <th>Team name Blue</th>
                        <th>Score Red</th>
                        <th>Score Blue</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game:Game2v2) => {
                        return (
                            <tr key={game.id}>
                                <td>{game.team1_name}</td>
                                <td>{game.team2_name}</td>
                                <td>{game.team1_score}</td>
                                <td>{game.team2_score}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
