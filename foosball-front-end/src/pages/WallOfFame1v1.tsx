export const wallOfFame1v1Route:string = "WallOfFame1v1"
export const WallOfFame1v1 = () => {
    return (
        <div className="App">
            <h1>Wall of fame 1v1</h1>
            <table>
                <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Elo</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Player 1</td>
                    <td>1786</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Player 2</td>
                    <td>937</td>
                </tr>
            </table>
        </div>
    );
}
