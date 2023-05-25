import React, { useCallback, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { lastGames1v1Route } from "../player/LastGames1v1";
import { makeGame1v1 } from '../../components/endpoints/admin/Games';

export const addGame1v1Route:string = "AddGame1v1"
export const AdminAddGame1v1 = () => {
    const navigate = useNavigate();
    const navigateToLastGames = () => {
        navigate('/admin/' + lastGames1v1Route);
    }
    const [redPoints, setRedPoints] = useState<number>();
    const [bluePoints, setBluePoints] = useState<number>();
    const [errorMessage, setErrorMessage] = useState("")
    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])

    const makeGame = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if(await makeGame1v1(playerRed, playerBlue, redPoints, bluePoints, setErrorMessage)) {
            navigateToLastGames()
        }
    }
    const [playerRed, setPlayerRed] = useState("");
    const [playerBlue, setPlayerBlue] = useState("");
    return (
        <div className="App">
            <h1>Make a new 1v1 game</h1>
            <form autoComplete="off" onSubmit={makeGame}>
                <div className="row">
                    <div className="left">
                        <h1 className="App-header">Red</h1>
                        <label>
                            Username
                            <input required type="text" placeholder="Username" onChange={e => setPlayerRed(e.target.value)} />
                        </label>
                        <label>
                            Score
                            <input required type="number" max="127" min="0" step="1" placeholder="Points" onChange={e => setRedPoints(parseInt(e.target.value))} />
                        </label>
                    </div>
                    <div className="right">
                        <h1 className="App-header">Blue</h1>
                        <label>
                            Username
                            <input required type="text" placeholder="Username" onChange={e => setPlayerBlue(e.target.value)} />
                        </label>
                        <label>
                            Score
                            <input required type="number" max="127" min="0" step="1" placeholder="Points" onChange={e => setBluePoints(parseInt(e.target.value))} />
                        </label>
                    </div>
                </div>
                {error()}
                <button type="submit" className='submitButton'>Enter game</button>
            </form>
        </div>
    );
}