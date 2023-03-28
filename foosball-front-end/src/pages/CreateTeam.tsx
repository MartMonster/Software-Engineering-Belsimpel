export const createTeamRoute: string = "CreateTeam"
export const CreateTeam = () => {
    return (
        <div className="App">
            <h1>Make a new foosball team</h1>
            <form>
                <label>
                    What will the name of your team be?
                    <input type="text" placeholder="Team name" />
                </label>
                <label>
                    What is the username of your teammate?
                    <input type="text" placeholder="Username" />
                </label>
                <button type="submit">Create team</button>
            </form>
        </div>
    );
}
