import React from 'react';
export const ownGames1v1Route: string = "self";
export const OwnGames1v1 = () => {
    return (
        <div className="App">
            <h1>Your last 10 1v1 games</h1>
            <table className="outerTable">
                <tr>
                    <th>Side</th>
                    <th>Players</th>
                    <th>Scores</th>
                    {/* <th>Edit</th>
                    <th>Delete</th> */}
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
                <tr>
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
                                Player Red
                            </p>
                            <p>
                                Player Blue
                            </p>
                        </div>
                    </td>
                    <td>
                        <div className="tableCol">
                            <p>
                                8
                            </p>
                            <p>
                                10
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
            </table>
        </div>
    );
}
