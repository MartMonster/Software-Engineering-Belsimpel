import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { lastGames2v2Route } from "../LastGames2v2";
import { ownGames2v2Route } from "../OwnGames2v2";
import { makeGame2v2 } from '../../components/axios';

export const addGame2v2Route: string = "AddGame2v2"
export const AdminAddGame2v2 = () => {
    const navigate = useNavigate();
    const navigateToOwnGames = () => {
        navigate('/' + lastGames2v2Route + '/' + ownGames2v2Route);
    }
    const [player2, setPlayer2] = useState("");
    const [player3, setPlayer3] = useState("");
    const [player4, setPlayer4] = useState("");
    const [myScore, setMyScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [side, setSide] = useState(0)

    const makeGame = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if(await makeGame2v2(player2, player3, player4, myScore, opponentScore, side)) {
            navigateToOwnGames()
        }
    }
    return (
        <div className="App">
            <h1>Make a new 2v2 game</h1>
            <form autoComplete="off" onSubmit={makeGame}>
                <div className="row">
                    <div className="left">
                        <h1 className="App-header">Red</h1>
                        <label>
                            Username
                            <input type="text" placeholder="Username" onChange={e => setPlayer2(e.target.value)} />
                        </label>
                        <label>
                            Username
                            <input type="text" placeholder="Username" onChange={e => setPlayer2(e.target.value)} />
                        </label>
                        <label>
                            Points
                            <input type="number" max="127" min="0" step="1" placeholder="Points" onChange={e => setMyScore(parseInt(e.target.value))} />
                        </label>
                    </div>
                    <div className="right">
                        <h1 className="App-header">Blue</h1>
                        <label>
                            Username
                            <input type="text" placeholder="Username" onChange={e => setPlayer2(e.target.value)} />
                        </label>
                        <label>
                            Username
                            <input type="text" placeholder="Username" onChange={e => setPlayer2(e.target.value)} />
                        </label>
                        <label>
                            Points
                            <input type="number" max="127" min="0" step="1" placeholder="Points" onChange={e => setMyScore(parseInt(e.target.value))} />
                        </label>
                    </div>
                </div>
                <button type="submit">Enter game</button>
            </form>
        </div>
    );
}