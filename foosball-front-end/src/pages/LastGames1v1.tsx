import React from 'react';
import { Link } from "react-router-dom";
import { ownGames1v1Route } from "./OwnGames1v1";
export const lastGames1v1Route: string = "LastGames1v1"
export const LastGames1v1 = () => {
    return (
        <div className="App">
            <h1>Last 10 1v1 games</h1>
            <Link className="App-link" to={ownGames1v1Route}>See own games</Link>
            <table>
                <tr>
                    <th>Player Red</th>
                    <th>Player Blue</th>
                    <th>Score Red</th>
                    <th>Score Blue</th>
                </tr>
                <tr>
                    <td>Player 1</td>
                    <td>Player 2</td>
                    <td>10</td>
                    <td>5</td>
                </tr>
                <tr>
                    <td>Player 1</td>
                    <td>Player 2</td>
                    <td>7</td>
                    <td>10</td>
                </tr>
            </table>
        </div>
    );
}
