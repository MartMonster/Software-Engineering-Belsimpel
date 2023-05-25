import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { lastGames2v2Route } from '../LastGames2v2';
import { editGame2v2 } from '../../components/endpoints/admin/Games';

export const AdminEditGame2v2 = () => {
    const idPar = useParams();
    let id: number = 0;
    if (idPar) {
        id = idPar.id as unknown as number;
    }
    const navigate = useNavigate();
    const navigateToOwnGames = () => {
        navigate('/admin/' + lastGames2v2Route);
    }
    
    const [searchParams] = useSearchParams();
    const [redPlayer1, setRedPlayer1] = useState("");
    const [redPlayer2, setRedPlayer2] = useState("");
    const [bluePlayer1, setBluePlayer1] = useState("");
    const [bluePlayer2, setBluePlayer2] = useState("");
    const [redScore, setRedScore] = useState<number>();
    const [blueScore, setBlueScore] = useState<number>();
    const [errorMessage, setErrorMessage] = useState("")
    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])

    const saveGame = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if (await editGame2v2(id, redPlayer1, redPlayer2, bluePlayer1, bluePlayer2, redScore, blueScore, setErrorMessage)) {
            navigateToOwnGames()
        }
    }
    // TODO: now uses team names but should use usernames
    useEffect(() => {
        if (searchParams.get("team1") as string) {
            setRedPlayer1(searchParams.get("team1") as string);
        }
        if (searchParams.get("team2") as string) {
            setBluePlayer1(searchParams.get("team2") as string);
        }
        if (searchParams.get("score1") as string) {
            setRedScore(parseInt(searchParams.get("score1") as string));
        }
        if (searchParams.get("score2") as string) {
            setBlueScore(parseInt(searchParams.get("score2") as string));
        }
    }, [searchParams])
    return (
        <div className="App">
            <h1>Edit your 2v2 game</h1>
            <form autoComplete="off" onSubmit={saveGame}>
                <div className="row">
                    <div className="left">
                        <h1 className="App-header">Red</h1>
                        <label>
                            Username
                            <input required type="text" placeholder="Username" defaultValue={redPlayer1} onChange={e => setRedPlayer1(e.target.value)} />
                        </label>
                        <label>
                            Username
                            <input required type="text" placeholder="Username" defaultValue={redPlayer2} onChange={e => setRedPlayer2(e.target.value)} />
                        </label>
                        <label>
                            Points
                            <input required type="number" max="127" min="0" step="1" placeholder="Points" defaultValue={redScore} onChange={e => setRedScore(parseInt(e.target.value))} />
                        </label>
                    </div>
                    <div className="right">
                        <h1 className="App-header">Blue</h1>
                        <label>
                            Username
                            <input required type="text" placeholder="Username" defaultValue={bluePlayer1} onChange={e => setBluePlayer1(e.target.value)} />
                        </label>
                        <label>
                            Username
                            <input required type="text" placeholder="Username" defaultValue={bluePlayer2} onChange={e => setBluePlayer2(e.target.value)} />
                        </label>
                        <label>
                            Points
                            <input required type="number" max="127" min="0" step="1" placeholder="Points" defaultValue={blueScore} onChange={e => setBlueScore(parseInt(e.target.value))} />
                        </label>
                    </div>
                </div>
                {error()}
                <button type="submit">Save game</button>
            </form>
            <Link to={'/admin/' + lastGames2v2Route}>
                <button>Cancel</button>
            </Link>
        </div>
    );
}