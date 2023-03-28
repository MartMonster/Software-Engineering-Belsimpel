import { Link, Outlet } from "react-router-dom";
export const lastGames1v1Route: string = "LastGames1v1"
export const LastGames1v1 = () => {
    return (
        <div className="App">
            <h1>Last 10 1v1 games</h1>
            <Link to="./self">See own games</Link>
            <Outlet/>
        </div>
    );
}
