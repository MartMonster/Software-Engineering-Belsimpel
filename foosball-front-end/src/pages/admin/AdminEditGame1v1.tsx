import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { lastGames1v1Route } from '../LastGames1v1';
import { editGame1v1 } from '../../components/admin/Games';

export const AdminEditGame1v1 = () => {
    const idPar = useParams();
    let id: number = 0;
    if (idPar) {
        id = idPar.id as unknown as number;
    }
    const navigate = useNavigate();
    const navigateToOwnGames = () => {
        navigate('/admin/' + lastGames1v1Route);
    }
    const saveGame = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if (await editGame1v1(id, playerRed, playerBlue, redPoints, bluePoints)) {
            navigateToOwnGames()
        }
    }
    const [playerRed, setPlayerRed] = useState("");
    const [playerBlue, setPlayerBlue] = useState("");
    const [redPoints, setRedPoints] = useState(0);
    const [bluePoints, setBluePoints] = useState(0);
    return (
        <div className="App">
            <h1>Edit a 1v1 game</h1>
            <form autoComplete="off" onSubmit={saveGame}>
                <div className="row">
                    <div className="left">
                        <h1 className="App-header">Red</h1>
                        <label>
                            Username
                            <input type="text" placeholder="Username" onChange={e => setPlayerRed(e.target.value)} />
                        </label>
                        <label>
                            Score
                            <input type="number" max="127" min="0" step="1" placeholder="Points" onChange={e => setRedPoints(parseInt(e.target.value))} />
                        </label>
                    </div>
                    <div className="right">
                        <h1 className="App-header">Blue</h1>
                        <label>
                            Username
                            <input type="text" placeholder="Username" onChange={e => setPlayerBlue(e.target.value)} />
                        </label>
                        <label>
                            Score
                            <input type="number" max="127" min="0" step="1" placeholder="Points" onChange={e => setBluePoints(parseInt(e.target.value))} />
                        </label>
                    </div>
                </div>
                <button type="submit">Save game</button>
            </form>
            <Link to={'/admin/' + lastGames1v1Route}>
                <button>Cancel</button>
            </Link>
        </div>
    );
}