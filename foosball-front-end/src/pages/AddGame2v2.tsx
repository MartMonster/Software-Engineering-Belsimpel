import React, { useCallback, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { lastGames2v2Route } from "./LastGames2v2";
import { ownGames2v2Route } from "./OwnGames2v2";
import { makeGame2v2 } from '../components/endpoints/player/Games';

export const addGame2v2Route: string = "AddGame2v2"
export const AddGame2v2 = () => {
    const navigate = useNavigate();
    const navigateToOwnGames = () => {
        navigate('/' + lastGames2v2Route + '/' + ownGames2v2Route);
    }
    const [player2, setPlayer2] = useState("");
    const [player3, setPlayer3] = useState("");
    const [player4, setPlayer4] = useState("");
    const [myScore, setMyScore] = useState<number>();
    const [opponentScore, setOpponentScore] = useState<number>();
    const [side, setSide] = useState(1)
    const [errorMessage, setErrorMessage] = useState("")
    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])

    const makeGame = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if(await makeGame2v2(player2, player3, player4, myScore, opponentScore, side, setErrorMessage)) {
            navigateToOwnGames()
        }
    }
    return (
        <div className="App">
            <h1>Make a new 2v2 game</h1>
            <form autoComplete="off" onSubmit={makeGame}>
                <label>
                    What side did you play on?
                    <select onChange={e => setSide(parseInt(e.target.value))}>
                        <option value="1">Red</option>
                        <option value="2">Blue</option>
                    </select>
                </label>
                <label>
                    What is the username of your teammate?
                    <input required type="text" placeholder="Username" onChange={e => setPlayer2(e.target.value)}/>
                </label>
                <label>
                    What are the usernames of your opponents?
                    <input required type="text" placeholder="Username" onChange={e => setPlayer3(e.target.value)}/>
                    <input required type="text" placeholder="Username" onChange={e => setPlayer4(e.target.value)}/>
                </label>
                <label>
                    How many points did your team score?
                    <input required type="number" max="127" min="0" step="1" placeholder="Points" onChange={e => setMyScore(parseInt(e.target.value))}/>
                </label>
                <label>
                    How many points did your opponents score?
                    <input required type="number" max="127" min="0" step="1" placeholder="Points" onChange={e => setOpponentScore(parseInt(e.target.value))}/>
                </label>
                {error()}
                <button type="submit">Enter game</button>
            </form>
        </div>
    );
}