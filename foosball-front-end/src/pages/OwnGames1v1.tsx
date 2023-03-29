import React from 'react';
export const ownGames1v1Route: string = "self";
export const OwnGames1v1 = () => {
    return (
        <div className="App">
            <h1>Your last 10 1v1 games</h1>
            <table>
                <tr>
                    <th>Player Red</th>
                    <th>Player Blue</th>
                    <th>Score Red</th>
                    <th>Score Blue</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                <tr>
                    <td>Player 1</td>
                    <td>Player 2</td>
                    <td>10</td>
                    <td>5</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Player 1</td>
                    <td>Player 2</td>
                    <td>7</td>
                    <td>10</td>
                </tr>
            </table>
            <table className="outerTable">
                <tr>
                    <th>Side</th>
                    <th>Players</th>
                    <th>Scores</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                <tr>
                    <td>
                        <table className="innerTable">
                            <tr>
                                <td>Red</td>
                            </tr>
                            <tr>
                                <td>Blue</td>
                            </tr>
                        </table>
                    </td>
                    <td>
                        <table className="innerTable">
                            <tr>
                                <td>Player Red</td>
                            </tr>
                            <tr>
                                <td>Player Blue</td>
                            </tr>
                        </table>
                    </td>
                    <td>
                        <table className="innerTable">
                            <tr>
                                <td>10</td>
                            </tr>
                            <tr>
                                <td>5</td>
                            </tr>
                        </table>
                    </td>
                    <td>
                        <button>Edit</button>
                    </td>
                    <td>
                        <button>Delete</button>
                    </td>
                </tr>
            </table>
        </div>
    );
}
