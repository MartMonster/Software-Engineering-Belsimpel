import { Link } from "react-router-dom";
import { ownGames2v2Route } from "./OwnGames2v2";
export const lastGames2v2Route: string = "LastGames2v2"
export const LastGames2v2 = () => {
    return (
        <div className="App">
            <h1>Last 10 2v2 games</h1>
            <Link to={ownGames2v2Route}>See own games</Link>
        </div>
    );
}
