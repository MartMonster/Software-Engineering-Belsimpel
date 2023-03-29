import { Link } from "react-router-dom";
import { ownGames2v2Route } from "./OwnGames2v2";
export const lastGames2v2Route: string = "LastGames2v2"
export const LastGames2v2 = () => {
    return (
        <div className="App">
            <h1>Last 10 2v2 games</h1>
            <Link className="App-link" to={ownGames2v2Route}>See own games</Link>
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
