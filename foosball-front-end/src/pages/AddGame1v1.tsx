export const addGame1v1Route:string = "AddGame1v1"
export const AddGame1v1 = () => {
    return (
        <div className="App">
            <h1>Make a new 1v1 game</h1>
            <form autoComplete="off">
                <label>
                    What side did you play on?
                    <select>
                        <option value="1">Red</option>
                        <option value="2">Blue</option>
                    </select>
                </label>
                <label>
                    What is the username of your opponent?
                    <input type="text" placeholder="Username"/>
                </label>
                <label>
                    How many points did you score?
                    <input type="number" step="1" placeholder="Points"/>
                </label>
                <label>
                    How many points did your opponent score?
                    <input type="number" step="1" placeholder="Points"/>
                </label>
                <button type="submit">Enter game</button>
            </form>
        </div>
    );
}