import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { ownGames2v2Route } from "./OwnGames2v2";
import { getLast10Games2v2, Game2v2 } from '../components/axios';

export const lastGames2v2Route: string = "LastGames2v2"
export const LastGames2v2 = () => {
    const [games, setGames] = useState<Game2v2[]>([]);
    useEffect(() => {
        getLast10Games2v2().then((data) => {
            setGames(data);
            console.log(data);
        });
    }, []);
    return (
        <div className="App">
            <h1>Last 10 2v2 games</h1>
            <Link className="App-link" to={ownGames2v2Route}>See own games</Link>
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
                    {games.map((game: Game2v2, index) => {
                        return (
                            <tr key={game.id}>
                                <td>{game.team1_name}</td>
                                <td>{game.team2_name}</td>
                                <td>{game.team1_score}</td>
                                <td>{game.team2_score}</td>
                            </tr>
                        );
                    })
                    }
                </tbody>
            </table>
        </div>
    );
}
