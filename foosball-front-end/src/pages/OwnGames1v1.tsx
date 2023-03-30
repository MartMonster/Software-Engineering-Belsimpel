import React, { useState, useEffect } from 'react';
import { getOwnGames1v1, Game1v1 } from '../components/axios';

export const ownGames1v1Route: string = "self";
export const OwnGames1v1 = () => {
    const [games, setGames] = useState<Game1v1[]>([]);
    useEffect(() => {
        getOwnGames1v1().then((data) => {
            if (data !== undefined) {
                setGames(data);
                console.log(data);
            }
        });
    }, []);
    return (
        <div className="App">
            <h1>Your last 10 1v1 games</h1>
            <table className="outerTable">
                <thead>
                    <tr>
                        <th>Side</th>
                        <th>Players</th>
                        <th>Scores</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game:Game1v1) => {
                        return (
                            <tr key={game.id}>
                                <td>
                                    <div className="tableCol">
                                        <p>
                                            Red
                                        </p>
                                        <p>
                                            Blue
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <div className="tableCol">
                                        <p>
                                            {game.player1_username}
                                        </p>
                                        <p>
                                            {game.player2_username}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <div className="tableCol">
                                        <p>
                                            {game.player1_score}
                                        </p>
                                        <p>
                                            {game.player2_score}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <button className='editButton'>Edit</button>
                                </td>
                                <td>
                                    <button className='deleteButton'>Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
