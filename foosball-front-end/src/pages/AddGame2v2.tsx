import React from 'react';
import { useNavigate } from "react-router-dom";
import { lastGames2v2Route } from "./LastGames2v2";
import { ownGames2v2Route } from "./OwnGames2v2";
export const addGame2v2Route: string = "AddGame2v2"
export const AddGame2v2 = () => {
    const navigate = useNavigate();
    const navigateToOwnGames = () => {
        navigate('/' + lastGames2v2Route + '/' + ownGames2v2Route);
    }
    return (
        <div className="App">
            <h1>Make a new 2v2 game</h1>
            <form autoComplete="off">
                <label>
                    What side did you play on?
                    <select>
                        <option value="1">Red</option>
                        <option value="2">Blue</option>
                    </select>
                </label>
                <label>
                    What is the username of your teammate?
                    <input type="text" placeholder="Username" />
                </label>
                <label>
                    What are the usernames of your opponents?
                    <input type="text" placeholder="Username" />
                    <input type="text" placeholder="Username" />
                </label>
                <label>
                    How many points did your team score?
                    <input type="number" step="1" placeholder="Points" />
                </label>
                <label>
                    How many points did your opponents score?
                    <input type="number" step="1" placeholder="Points" />
                </label>
            <button type="submit" onClick={navigateToOwnGames}>Enter game</button>
            </form>
        </div>
    );
}