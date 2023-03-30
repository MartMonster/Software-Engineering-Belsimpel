import React, { useEffect, useState} from 'react';
import { Link } from "react-router-dom";
import { wallOfFame1v1Route } from "./WallOfFame1v1";
import { wallOfFame2v2Route } from "./WallOfFame2v2";
import { addGame1v1Route } from "./AddGame1v1";
import { addGame2v2Route } from "./AddGame2v2";
import { lastGames1v1Route } from "./LastGames1v1";
import { lastGames2v2Route } from "./LastGames2v2";
import { createTeamRoute } from "./CreateTeam";
import { getUserSummary } from '../components/axios';
import { ownTeamsRoute } from './OwnTeams';

const Dashboard = () => {
    const [username, setUsername] = useState("");
    const [position, setPosition] = useState(0);
    const [elo, setElo] = useState(0);
    useEffect(() => {
        getUserSummary().then((data) => {
            if (data !== undefined) {
                setUsername(data.username);
                setPosition(data.position);
                setElo(data.elo);
            }
        });
    }, []);
    return (
        <div className="App">
            <h1>Dashboard</h1>
            <p>Hello {username}, you are in the top {position} players, and you have {elo} elo.</p>
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
                <Link className="dashboardLink" to={ownTeamsRoute}>
                    <button>Own teams</button>
                </Link>
            </div>
        </div>
    );
}

export default Dashboard;