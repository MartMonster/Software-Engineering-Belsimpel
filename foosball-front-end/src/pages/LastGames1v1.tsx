import { Link } from "react-router-dom";
import { ownGames1v1Route } from "./OwnGames1v1";
export const lastGames1v1Route: string = "LastGames1v1"
export const LastGames1v1 = () => {
    return (
        <div className="App">
            <h1>Last 10 1v1 games</h1>
            <Link to={ownGames1v1Route}>See own games</Link>
        </div>
    );
}
