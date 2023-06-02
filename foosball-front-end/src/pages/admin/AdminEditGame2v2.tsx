import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { lastGames2v2Route } from '../player/LastGames2v2';
import { editGame2v2 } from '../../components/endpoints/admin/Games';

export const AdminEditGame2v2 = () => {
    const idPar = useParams();
    const [searchParams] = useSearchParams();
    const [redTeam, setRedTeam] = useState("");
    const [blueTeam, setBlueTeam] = useState("");
    const [swap, setSwap] = useState<number>(0); // [0, 1]
    const [redScore, setRedScore] = useState<number>();
    const [blueScore, setBlueScore] = useState<number>();
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate();

    let id: number = 0;
    if (idPar) {
        id = idPar.id as unknown as number;
    }

    const navigateToOwnGames = () => {
        navigate('/admin/' + lastGames2v2Route);
    }
    
    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])

    const saveGame = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if (await editGame2v2(id, redScore, blueScore, swap, setErrorMessage)) {
            navigateToOwnGames()
        }
    }
    useEffect(() => {
        if (searchParams.get("team1") as string) {
            setRedTeam(searchParams.get("team1") as string);
        }
        if (searchParams.get("team2") as string) {
            setBlueTeam(searchParams.get("team2") as string);
        }
        if (searchParams.get("score1") as string) {
            setRedScore(parseInt(searchParams.get("score1") as string));
        }
        if (searchParams.get("score2") as string) {
            setBlueScore(parseInt(searchParams.get("score2") as string));
        }
    }, [searchParams])

    const swapTeams = () => {
        let tempTeam = redTeam;
        setRedTeam(blueTeam);
        setBlueTeam(tempTeam);
        setSwap((swap + 1)%2);
    }

    return (
        <div className="App">
            <h1>Edit your 2v2 game</h1>
            <form autoComplete="off" onSubmit={saveGame}>
                <div className="row">
                    <div className="left">
                        <h1 className="App-header">Red</h1>
                        <label>
                            Team name
                            <input required disabled type="text" maxLength={255} placeholder="Username" defaultValue={redTeam} />
                        </label>
                        <label>
                            Points
                            <input required type="number" max="10" min="0" step="1" placeholder="Points" defaultValue={redScore} onChange={e => setRedScore(parseInt(e.target.value))} />
                        </label>
                    </div>
                    <div>
                        <button className='swapButton' type='button' onClick={swapTeams}>Swap</button>
                    </div>
                    <div className="right">
                        <h1 className="App-header">Blue</h1>
                        <label>
                            Team name
                            <input required disabled type="text" maxLength={255} placeholder="Username" defaultValue={blueTeam} />
                        </label>
                        <label>
                            Points
                            <input required type="number" max="10" min="0" step="1" placeholder="Points" defaultValue={blueScore} onChange={e => setBlueScore(parseInt(e.target.value))} />
                        </label>
                    </div>
                </div>
                {error()}
                <button type="submit" className='submitButton'>Save game</button>
            </form>
            <Link to={'/admin/' + lastGames2v2Route}>
                <button>Cancel</button>
            </Link>
        </div>
    );
}