import React, {useCallback, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {lastGames1v1Route} from "./LastGames1v1";
import {ownGames1v1Route} from "./OwnGames1v1";
import {makeGame1v1} from '../../components/endpoints/player/Games';

export const addGame1v1Route: string = "AddGame1v1"
export const AddGame1v1 = () => {
    const navigate = useNavigate();
    const [opponent, setOpponent] = useState("");
    const [myPoints, setMyPoints] = useState<number>();
    const [opponentPoints, setOpponentPoints] = useState<number>();
    const [side, setSide] = useState(1);
    const [errorMessage, setErrorMessage] = useState("")

    const navigateToOwnGames = () => {
        navigate('/' + lastGames1v1Route + '/' + ownGames1v1Route);
    }

    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])

    const makeGame = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if (await makeGame1v1(opponent, myPoints, opponentPoints, side, setErrorMessage)) {
            navigateToOwnGames()
        }
    }

    return (
        <div className="App">
            <h1>Make a new 1v1 game</h1>
            <form autoComplete="off" onSubmit={makeGame}>
                <label>
                    What side did you play on?
                    <select onChange={e => setSide(parseInt(e.target.value))}>
                        <option value="1">Red</option>
                        <option value="2">Blue</option>
                    </select>
                </label>
                <label>
                    What is the username of your opponent?
                    <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                           type="text" maxLength={255} placeholder="Username"
                           onChange={e => setOpponent(e.target.value)}/>
                </label>
                <label>
                    How many points did you score?
                    <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                           type="number" max="10" min="0" step="1" placeholder="Points"
                           onChange={e => setMyPoints(parseInt(e.target.value))}/>
                </label>
                <label>
                    How many points did your opponent score?
                    <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                           type="number" max="10" min="0" step="1" placeholder="Points"
                           onChange={e => setOpponentPoints(parseInt(e.target.value))}/>
                </label>
                {error()}
                <button type="submit" className='submitButton'>Enter game</button>
            </form>
        </div>
    );
}