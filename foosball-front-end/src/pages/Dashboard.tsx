import { Link } from "react-router-dom";
var username:string = "UserName";
var position:number = 1;
var elo:number = 1000;
const Dashboard = () => {
    return (
        <div className="App">
            <h1>Dashboard</h1>
            <p>Hello {username}, you are in the top {position} players, and you have {elo} elo.</p>
            <div className="dashboardButtons">
                <Link className="dashboardLink" to="/walloffame1v1">
                    <button>Wall of fame 1v1</button>
                </Link>
                <Link className="dashboardLink" to="/walloffame2v2">
                    <button>Wall of fame 2v2</button>
                </Link>
                <Link className="dashboardLink" to="/add1v1game">
                    <button>Add 1v1 game</button>
                </Link>
                <Link className="dashboardLink" to="/add2v2game">
                    <button>Add 2v2 game</button>
                </Link>
                <Link className="dashboardLink" to="/1v1games">
                    <button>1v1 games</button>
                </Link>
                <Link className="dashboardLink" to="/2v2games">
                    <button>2v2 games</button>
                </Link>
                <Link className="dashboardLink" to="/createteam">
                    <button>Create team</button>
                </Link>
                <Link className="dashboardLink" to="/listofteams">
                    <button>List of teams</button>
                </Link>
            </div>
        </div>
    );
}

export default Dashboard;