import React, { useState } from 'react';
import { useNavigate, Link, useParams } from "react-router-dom";
import { lastGames1v1Route } from "./LastGames1v1";
import { ownGames1v1Route } from "./OwnGames1v1";
import { editGame1v1 } from '../components/axios';

export const editGame1v1Route:string = "edit"
export const EditGame1v1 = () => {
    const idPar = useParams();
    let id: number = 0;
    if (idPar) {
        id = idPar.id as unknown as number;
    }
    const navigate = useNavigate();
    const navigateToOwnGames = () => {
        navigate('/' + lastGames1v1Route +'/'+ ownGames1v1Route);
    }
    const [myPoints, setMyPoints] = useState(0);
    const [opponentPoints, setOpponentPoints] = useState(0);
    const [side, setSide] = useState(0);
    const makeGame = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if(await editGame1v1(id, myPoints, opponentPoints, side)) {
            navigateToOwnGames()
        }
    }
    return (
        <div className="App">
            <h1>Edit your 1v1 game</h1>
            <form autoComplete="off" onSubmit={makeGame}>
                <label>
                    What side did you play on?
                    <select onChange={e => setSide(parseInt(e.target.value))}>
                        <option value="1">Red</option>
                        <option value="2">Blue</option>
                    </select>
                </label>
                <label>
                    How many points did you score?
                    <input type="number" step="1" placeholder="Points" onChange={e => setMyPoints(parseInt(e.target.value))}/>
                </label>
                <label>
                    How many points did your opponent score?
                    <input type="number" step="1" placeholder="Points" onChange={e => setOpponentPoints(parseInt(e.target.value))}/>
                </label>
                <button type="submit">Save game</button>
            </form>
            <Link to={'/' + lastGames1v1Route +'/'+ ownGames1v1Route}>
                <button>Cancel</button>
            </Link>
        </div>
    );
}