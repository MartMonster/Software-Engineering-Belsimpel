import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link, useParams, useSearchParams } from "react-router-dom";
import { editGame2v2 } from '../../components/endpoints/player/Games';
import { ownGames2v2Route } from './OwnGames2v2';
import { lastGames2v2Route } from './LastGames2v2';

export const editGame2v2Route: string = "edit"
export const EditGame2v2 = () => {
    const idPar = useParams();
    let id: number = 0;
    if (idPar) {
        id = idPar.id as unknown as number;
    }
    const navigate = useNavigate();
    const navigateToOwnGames = () => {
        navigate('/' + lastGames2v2Route + '/' + ownGames2v2Route);
    }
    const [myPoints, setMyPoints] = useState<number>();
    const [opponentPoints, setOpponentPoints] = useState<number>();
    const [side, setSide] = useState(1);
    const [errorMessage, setErrorMessage] = useState("")
    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])
    const saveGame = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if (await editGame2v2(id, myPoints, opponentPoints, side, setErrorMessage)) {
            navigateToOwnGames()
        }
    }
    const [searchParams] = useSearchParams();
    useEffect(() => {
        if (searchParams.get("score1") as string) {
            setMyPoints(parseInt(searchParams.get("score1") as string));
        }
        if (searchParams.get("score2") as string) {
            setOpponentPoints(parseInt(searchParams.get("score2") as string));
        }
    }, [searchParams])
    return (
        <div className="App">
            <h1>Edit your 2v2 game</h1>
            <form autoComplete="off" onSubmit={saveGame}>
                <label>
                    What side did you play on?
                    <select onChange={e => setSide(parseInt(e.target.value))}>
                        <option value="1">Red</option>
                        <option value="2">Blue</option>
                    </select>
                </label>
                <label>
                    How many points did your team score?
                    <input required type="number" max="127" min="0" step="1" placeholder="Points" defaultValue={myPoints} onChange={e => setMyPoints(parseInt(e.target.value))} />
                </label>
                <label>
                    How many points did your opponents score?
                    <input required type="number" max="127" min="0" step="1" placeholder="Points" defaultValue={opponentPoints} onChange={e => setOpponentPoints(parseInt(e.target.value))} />
                </label>
                {error()}
                <button type="submit" className='submitButton'>Save game</button>
            </form>
            <Link to={'/' + lastGames2v2Route + '/' + ownGames2v2Route}>
                <button>Cancel</button>
            </Link>
        </div>
    );
}