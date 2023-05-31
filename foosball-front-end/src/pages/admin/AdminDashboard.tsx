import React from 'react';
import { Link } from "react-router-dom";
import { wallOfFame1v1Route } from "../player/WallOfFame1v1";
import { wallOfFame2v2Route } from "../player/WallOfFame2v2";
import { addGame1v1Route } from "../player/AddGame1v1";
import { addGame2v2Route } from "../player/AddGame2v2";
import { lastGames1v1Route } from "../player/LastGames1v1";
import { lastGames2v2Route } from "../player/LastGames2v2";
import { createTeamRoute } from "../player/CreateTeam";

const AdminDashboard = () => {
    return (
        <div className="App">
            <h1>Dashboard</h1>
            <div className="dashboardButtons">
                <Link className="dashboardLink" to={wallOfFame1v1Route}>
                    <button>Wall of fame 1v1</button>
                </Link>
                <Link className="dashboardLink" to={wallOfFame2v2Route}>
                    <button>Wall of fame 2v2</button>
                </Link>
                <Link className="dashboardLink" to={addGame1v1Route}>
                    <button>Add 1v1 game</button>
                </Link>
                <Link className="dashboardLink" to={addGame2v2Route}>
                    <button>Add 2v2 game</button>
                </Link>
                <Link className="dashboardLink" to={lastGames1v1Route}>
                    <button>1v1 games</button>
                </Link>
                <Link className="dashboardLink" to={lastGames2v2Route}>
                    <button>2v2 games</button>
                </Link>
                <Link className="dashboardLink" to={createTeamRoute}>
                    <button>Create team</button>
                </Link>
            </div>
        </div>
    );
}

export default AdminDashboard;