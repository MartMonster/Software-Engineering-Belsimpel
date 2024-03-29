import React, {useCallback, useEffect, useState} from 'react';
import {Link, useNavigate, useParams, useSearchParams} from 'react-router-dom';
import {lastGames1v1Route} from '../player/LastGames1v1';
import {editGame1v1} from '../../components/endpoints/admin/Games';

export const AdminEditGame1v1 = () => {
    const idPar = useParams();
    let id: number = 0;
    const [searchParams] = useSearchParams();
    const [playerRed, setPlayerRed] = useState("");
    const [playerBlue, setPlayerBlue] = useState("");
    const [swap, setSwap] = useState<number>(0); // [0, 1]
    const [redPoints, setRedPoints] = useState<number>();
    const [bluePoints, setBluePoints] = useState<number>();
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate();

    if (idPar) {
        id = idPar.id as unknown as number;
    }

    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])

    const navigateToOwnGames = () => {
        navigate('/admin/' + lastGames1v1Route);
    }

    const saveGame = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if (await editGame1v1(id, redPoints, bluePoints, swap, setErrorMessage)) {
            navigateToOwnGames()
        }
    }

    useEffect(() => {
        if (searchParams.get("player1") as string) {
            setPlayerRed(searchParams.get("player1") as string);
        }
        if (searchParams.get("player2") as string) {
            setPlayerBlue(searchParams.get("player2") as string);
        }
        if (searchParams.get("score1") as string) {
            setRedPoints(parseInt(searchParams.get("score1") as string));
        }
        if (searchParams.get("score2") as string) {
            setBluePoints(parseInt(searchParams.get("score2") as string));
        }
    }, [searchParams])

    const swapPlayers = () => {
        let tempTeam = playerRed;
        setPlayerRed(playerBlue);
        setPlayerBlue(tempTeam);
        setSwap((swap + 1) % 2);
    }

    return (
        <div className="App">
            <h1>Edit a 1v1 game</h1>
            <form autoComplete="off" onSubmit={saveGame}>
                <div className="row">
                    <div className="left">
                        <h1 className="App-header">Red</h1>
                        <label>
                            Username
                            <input required disabled type="text" maxLength={255} placeholder="Username"
                                   defaultValue={playerRed}/>
                        </label>
                        <label>
                            Score
                            <input required type="number" max="10" min="0" step="1" placeholder="Points"
                                   defaultValue={redPoints} onChange={e => setRedPoints(parseInt(e.target.value))}/>
                        </label>
                    </div>
                    <div>
                        <button className='swapButton' type='button' onClick={swapPlayers}>Swap</button>
                    </div>
                    <div className="right">
                        <h1 className="App-header">Blue</h1>
                        <label>
                            Username
                            <input required disabled type="text" maxLength={255} placeholder="Username"
                                   defaultValue={playerBlue}/>
                        </label>
                        <label>
                            Score
                            <input required type="number" max="10" min="0" step="1" placeholder="Points"
                                   defaultValue={bluePoints} onChange={e => setBluePoints(parseInt(e.target.value))}/>
                        </label>
                    </div>
                </div>
                {error()}
                <button type="submit" className='submitButton'>Save game</button>
            </form>
            <Link to={'/admin/' + lastGames1v1Route}>
                <button>Cancel</button>
            </Link>
        </div>
    );
}