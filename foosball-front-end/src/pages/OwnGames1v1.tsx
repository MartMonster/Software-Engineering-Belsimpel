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
