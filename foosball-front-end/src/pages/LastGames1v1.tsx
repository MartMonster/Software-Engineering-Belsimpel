import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { ownGames1v1Route } from "./OwnGames1v1";
import { getLast10Games1v1, Game1v1 } from '../components/axios';

export const lastGames1v1Route: string = "LastGames1v1"
export const LastGames1v1 = () => {
    const [games, setGames] = useState<Game1v1[]>([]);
    useEffect(() => {
        getLast10Games1v1().then((data) => {
            setGames(data.games);
            console.log(data);
        });
    }, []);
    return (
        <div className="App">
            <h1>Last 10 1v1 games</h1>
            <Link className="App-link" to={ownGames1v1Route}>See own games</Link>
            <table>
                <thead>
                    <tr>
                        <th>Player Red</th>
                        <th>Player Blue</th>
                        <th>Score Red</th>
                        <th>Score Blue</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game: Game1v1, index) => {
                        return (
                            <tr key={game.id}>
                                <td>{game.player1_username}</td>
                                <td>{game.player2_username}</td>
                                <td>{game.player1_score}</td>
                                <td>{game.player2_score}</td>
                            </tr>
                        );
                    })
                    }
                </tbody>
            </table>
        </div>
    );
}
