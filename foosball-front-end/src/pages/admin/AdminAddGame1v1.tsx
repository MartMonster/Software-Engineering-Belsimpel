import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { lastGames1v1Route } from "../LastGames1v1";
import { ownGames1v1Route } from "../OwnGames1v1";
import { makeGame1v1 } from '../../components/axios';

export const addGame1v1Route:string = "AddGame1v1"
export const AdminAddGame1v1 = () => {
    const navigate = useNavigate();
    const navigateToOwnGames = () => {
        navigate('/' + lastGames1v1Route +'/'+ ownGames1v1Route);
    }
    const [opponent, setOpponent] = useState("");
    const [myPoints, setMyPoints] = useState(0);
    const [opponentPoints, setOpponentPoints] = useState(0);
    const [side, setSide] = useState(0);
    const makeGame = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if(await makeGame1v1(opponent, myPoints, opponentPoints, side)) {
            navigateToOwnGames()
        }
    }
    return (
        <div className="App">
            <h1>Make a new 1v1 game</h1>
            <form autoComplete="off" onSubmit={makeGame}>
                <div className="row">
                    <div className="left">
                        <h1 className="App-header">Red</h1>
                        <label>
                            Username
                            <input type="text" placeholder="Username" onChange={e => setOpponent(e.target.value)} />
                        </label>
                        <label>
                            Score
                            <input type="number" max="127" min="0" step="1" placeholder="Points" onChange={e => setMyPoints(parseInt(e.target.value))} />
                        </label>
                    </div>
                    <div className="right">
                        <h1 className="App-header">Blue</h1>
                        <label>
                            Username
                            <input type="text" placeholder="Username" onChange={e => setOpponent(e.target.value)} />
                        </label>
                        <label>
                            Score
                            <input type="number" max="127" min="0" step="1" placeholder="Points" onChange={e => setMyPoints(parseInt(e.target.value))} />
                        </label>
                    </div>
                </div>
                <button type="submit">Enter game</button>
            </form>
        </div>
    );
}