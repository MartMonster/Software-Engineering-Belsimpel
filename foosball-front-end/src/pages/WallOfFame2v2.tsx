import React from 'react';
export const wallOfFame2v2Route: string = "WallOfFame2v2"
export const WallOfFame2v2 = () => {
    return (
        <div className="App">
            <h1>Wall of fame 2v2</h1>
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
                    <td>2</td>
                    <td>Team name</td>
                    <td>Player 2</td>
                    <td>Player 3</td>
                    <td>937</td>
                </tr>
            </table>
        </div>
    );
}
