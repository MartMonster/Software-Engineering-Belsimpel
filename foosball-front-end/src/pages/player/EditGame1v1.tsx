import React, {useCallback, useEffect, useState} from 'react';
import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {lastGames1v1Route} from "./LastGames1v1";
import {ownGames1v1Route} from "./OwnGames1v1";
import {editGame1v1} from '../../components/endpoints/player/Games';

export const editGame1v1Route: string = "edit"
export const EditGame1v1 = () => {
    const idPar = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [myPoints, setMyPoints] = useState<number>();
    const [opponentPoints, setOpponentPoints] = useState<number>();
    const [side, setSide] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");

    let id: number = 0;
    if (idPar) {
        id = idPar.id as unknown as number;
    }

    const navigateToOwnGames = () => {
        navigate('/' + lastGames1v1Route + '/' + ownGames1v1Route);
    }

    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])

    const saveGame = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if (await editGame1v1(id, myPoints, opponentPoints, side, setErrorMessage)) {
            navigateToOwnGames()
        }
    }

    useEffect(() => {
        if (searchParams.get("player1") as string === sessionStorage.getItem("username")) {
            setSide(1);
            setMyPoints(parseInt(searchParams.get("score1") as string));
            setOpponentPoints(parseInt(searchParams.get("score2") as string));
        } else {
            setSide(2);
            setMyPoints(parseInt(searchParams.get("score2") as string));
            setOpponentPoints(parseInt(searchParams.get("score1") as string));
        }
    }, [searchParams])

    return (
        <div className="App">
            <h1>Edit your 1v1 game</h1>
            <form autoComplete="off" onSubmit={saveGame}>
                <label>
                    What side did you play on?
                    <select value={side.toString()} onChange={e => setSide(parseInt(e.target.value))}>
                        <option value="1">Red</option>
                        <option value="2">Blue</option>
                    </select>
                </label>
                <label>
                    How many points did you score?
                    <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                           type="number" max="10" min="0" step="1" placeholder="Points" defaultValue={myPoints}
                           onChange={e => setMyPoints(parseInt(e.target.value))}/>
                </label>
                <label>
                    How many points did your opponent score?
                    <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                           type="number" max="10" min="0" step="1" placeholder="Points" defaultValue={opponentPoints}
                           onChange={e => setOpponentPoints(parseInt(e.target.value))}/>
                </label>
                {error()}
                <button type="submit" className='submitButton'>Save game</button>
            </form>
            <Link to={'/' + lastGames1v1Route + '/' + ownGames1v1Route}>
                <button>Cancel</button>
            </Link>
        </div>
    );
}