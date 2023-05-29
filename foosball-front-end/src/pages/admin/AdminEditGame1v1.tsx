import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { lastGames1v1Route } from '../player/LastGames1v1';
import { editGame1v1 } from '../../components/endpoints/admin/Games';

export const AdminEditGame1v1 = () => {
    const idPar = useParams();
    let id: number = 0;
    const [searchParams] = useSearchParams();
    const [playerRed, setPlayerRed] = useState("");
    const [playerBlue, setPlayerBlue] = useState("");
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
        if (await editGame1v1(id, playerRed, playerBlue, redPoints, bluePoints, setErrorMessage)) {
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

    return (
        <div className="App">
            <h1>Edit a 1v1 game</h1>
            <form autoComplete="off" onSubmit={saveGame}>
                <div className="row">
                    <div className="left">
                        <h1 className="App-header">Red</h1>
                        <label>
                            Username
                            <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed" type="text" maxLength={255} placeholder="Username" defaultValue={playerRed} onChange={e => setPlayerRed(e.target.value)} />
                        </label>
                        <label>
                            Score
                            <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed" type="number" max="127" min="0" step="1" placeholder="Points" defaultValue={redPoints} onChange={e => setRedPoints(parseInt(e.target.value))} />
                        </label>
                    </div>
                    <div className="right">
                        <h1 className="App-header">Blue</h1>
                        <label>
                            Username
                            <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed" type="text" maxLength={255} placeholder="Username" defaultValue={playerBlue} onChange={e => setPlayerBlue(e.target.value)} />
                        </label>
                        <label>
                            Score
                            <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed" type="number" max="127" min="0" step="1" placeholder="Points" defaultValue={bluePoints} onChange={e => setBluePoints(parseInt(e.target.value))} />
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