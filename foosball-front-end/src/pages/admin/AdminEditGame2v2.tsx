import React, { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { lastGames2v2Route } from '../LastGames2v2';
import { editGame2v2 } from '../../components/admin/Games';

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
    
    const [redPlayer1, setRedPlayer1] = useState("");
    const [redPlayer2, setRedPlayer2] = useState("");
    const [bluePlayer1, setBluePlayer1] = useState("");
    const [bluePlayer2, setBluePlayer2] = useState("");
    const [redScore, setRedScore] = useState(0);
    const [blueScore, setBlueScore] = useState(0);
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
    return (
        <div className="App">
            <h1>Edit your 2v2 game</h1>
            <form autoComplete="off" onSubmit={saveGame}>
                <div className="row">
                    <div className="left">
                        <h1 className="App-header">Red</h1>
                        <label>
                            Username
                            <input type="text" placeholder="Username" onChange={e => setRedPlayer1(e.target.value)} />
                        </label>
                        <label>
                            Username
                            <input type="text" placeholder="Username" onChange={e => setRedPlayer2(e.target.value)} />
                        </label>
                        <label>
                            Points
                            <input type="number" max="127" min="0" step="1" placeholder="Points" onChange={e => setRedScore(parseInt(e.target.value))} />
                        </label>
                    </div>
                    <div className="right">
                        <h1 className="App-header">Blue</h1>
                        <label>
                            Username
                            <input type="text" placeholder="Username" onChange={e => setBluePlayer1(e.target.value)} />
                        </label>
                        <label>
                            Username
                            <input type="text" placeholder="Username" onChange={e => setBluePlayer2(e.target.value)} />
                        </label>
                        <label>
                            Points
                            <input type="number" max="127" min="0" step="1" placeholder="Points" onChange={e => setBlueScore(parseInt(e.target.value))} />
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