import { useNavigate } from "react-router-dom";
import { listOfTeamsRoute } from "./ListOfTeams";
import { ownTeamsRoute } from "./OwnTeams";
export const createTeamRoute: string = "CreateTeam"
export const CreateTeam = () => {
    const navigate = useNavigate();
    const navigateToOwnTeams = () => {
        navigate('/' + listOfTeamsRoute + '/' + ownTeamsRoute);
    }
    return (
        <div className="App">
            <h1>Make a new foosball team</h1>
            <form autoComplete="off">
                <label>
                    What will the name of your team be?
                    <input type="text" placeholder="Team name" />
                </label>
                <label>
                    What is the username of your teammate?
                    <input type="text" placeholder="Username" />
                </label>
                <button type="submit" onClick={navigateToOwnTeams}>Create team</button>
            </form>
        </div>
    );
}
