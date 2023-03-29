import React from 'react';
import { Link } from "react-router-dom";
import { ownTeamsRoute } from "./OwnTeams";
export const listOfTeamsRoute: string = "teams"
export const ListOfTeams = () => {
    return (
        <div className="App">
            <h1>Teams</h1>
            <Link className="App-link" to={ownTeamsRoute}>See own teams</Link>
            <table>
                <tr>
                    <th>Team name</th>
                    <th>Username</th>
                    <th>Username</th>
                </tr>
                <tr>
                    <td>Team name</td>
                    <td>Player 1</td>
                    <td>Player 2</td>
                </tr>
                <tr>
                    <td>Team name</td>
                    <td>Player 2</td>
                    <td>Player 3</td>
                </tr>
            </table>
        </div>
    );
}
