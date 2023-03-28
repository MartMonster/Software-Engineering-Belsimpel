export const ownGames2v2Route: string = "self";
export const OwnGames2v2 = () => {
    return (
        <div className="App">
            <h1>Your last 10 2v2 games</h1>
            <table>
                <tr>
                    <th>Team name Red</th>
                    <th>Team name Blue</th>
                    <th>Score Red</th>
                    <th>Score Blue</th>
                </tr>
                <tr>
                    <td>Team name Red</td>
                    <td>Team name Red</td>
                    <td>10</td>
                    <td>2</td>
                </tr>
                <tr>
                    <td>Team name Red</td>
                    <td>Team name Blue</td>
                    <td>9</td>
                    <td>10</td>
                </tr>
            </table>
        </div>
    );
}
