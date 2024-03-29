import React, {useCallback, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {wallOfFame1v1Route} from "./WallOfFame1v1";
import {wallOfFame2v2Route} from "./WallOfFame2v2";
import {addGame1v1Route} from "./AddGame1v1";
import {addGame2v2Route} from "./AddGame2v2";
import {lastGames1v1Route} from "./LastGames1v1";
import {lastGames2v2Route} from "./LastGames2v2";
import {createTeamRoute} from "./CreateTeam";
import {getUserSummary} from '../../components/endpoints/player/Users';
import {ownTeamsRoute} from './OwnTeams';
import {editUsernameRoute} from './EditUsername';

const Dashboard = () => {
    const [username, setUsername] = useState("");
    const [position, setPosition] = useState<number>(0);
    const [elo, setElo] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState("");

    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])

    const getUsers = useCallback(() => {
        if (sessionStorage.getItem("username")) {
            setUsername(sessionStorage.getItem("username") as string);
        }
        getUserSummary(setErrorMessage).then((data) => {
            setUsername(data.username);
            sessionStorage.setItem("username", data.username);
            setPosition(data.position);
            setElo(data.elo);
        });
    }, []);

    useEffect(getUsers, [getUsers]);

    return (
        <div className="App">
            <h1>Dashboard</h1>
            <p>Hello {username}, you are #{position} on the leaderboard, and you have {Math.round(elo)} elo.</p>
            {error()}
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
                <Link className="dashboardLink" to={`${editUsernameRoute}?username=${username}`}>
                    <button>Edit username</button>
                </Link>
            </div>
        </div>
    );
}

export default Dashboard;