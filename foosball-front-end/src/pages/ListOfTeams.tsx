import { Link } from "react-router-dom";
import { ownTeamsRoute } from "./OwnTeams";
export const listOfTeamsRoute: string = "teams"
export const ListOfTeams = () => {
    return (
        <div className="App">
            <h1>Teams</h1>
            <Link to={ownTeamsRoute}>See own teams</Link>
        </div>
    );
}
