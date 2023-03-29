import React from 'react';
export const ownTeamsRoute: string = "self";
export const OwnTeams = () => {
    return (
        <div className="App">
            <h1>Your teams</h1>
            <table>
                <tr>
                    <th>#</th>
                    <th>Team name</th>
                    <th>Username</th>
                    <th>Username</th>
                    <th>Elo</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Team name</td>
                    <td>Player 1</td>
                    <td>Player 2</td>
                    <td>1786</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>Team name</td>
                    <td>Player 1</td>
                    <td>Player 3</td>
                    <td>937</td>
                </tr>
            </table>
        </div>
    );
}
