import React from 'react';
import { useNavigate } from "react-router-dom";
import { lastGames1v1Route } from "./LastGames1v1";
import { ownGames1v1Route } from "./OwnGames1v1";
export const addGame1v1Route:string = "AddGame1v1"
export const AddGame1v1 = () => {
    const navigate = useNavigate();
    const navigateToOwnGames = () => {
        navigate('/' + lastGames1v1Route +'/'+ ownGames1v1Route);
    }
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
                <button type="submit" onClick={navigateToOwnGames}>Enter game</button>
            </form>
        </div>
    );
}