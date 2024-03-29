import React, {useCallback, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {lastGames2v2Route} from "../player/LastGames2v2";
import {makeGame2v2} from '../../components/endpoints/admin/Games';

export const addGame2v2Route: string = "AddGame2v2"
export const AdminAddGame2v2 = () => {
    const navigate = useNavigate();
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

    const navigateToLastGames = () => {
        navigate('/admin/' + lastGames2v2Route);
    }

    const makeGame = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if (await makeGame2v2(redPlayer1, redPlayer2, bluePlayer1, bluePlayer2, redScore, blueScore, setErrorMessage)) {
            navigateToLastGames()
        }
    }

    return (
        <div className="App">
            <h1>Make a new 2v2 game</h1>
            <form autoComplete="off" onSubmit={makeGame}>
                <div className="row">
                    <div className="left">
                        <h1 className="App-header">Red</h1>
                        <label>
                            Username
                            <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                                   type="text" maxLength={255} placeholder="Username"
                                   onChange={e => setRedPlayer1(e.target.value)}/>
                        </label>
                        <label>
                            Username
                            <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                                   type="text" maxLength={255} placeholder="Username"
                                   onChange={e => setRedPlayer2(e.target.value)}/>
                        </label>
                        <label>
                            Points
                            <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                                   type="number" max="10" min="0" step="1" placeholder="Points"
                                   onChange={e => setRedScore(parseInt(e.target.value))}/>
                        </label>
                    </div>
                    <div className="right">
                        <h1 className="App-header">Blue</h1>
                        <label>
                            Username
                            <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                                   type="text" maxLength={255} placeholder="Username"
                                   onChange={e => setBluePlayer1(e.target.value)}/>
                        </label>
                        <label>
                            Username
                            <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                                   type="text" maxLength={255} placeholder="Username"
                                   onChange={e => setBluePlayer2(e.target.value)}/>
                        </label>
                        <label>
                            Points
                            <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                                   type="number" max="10" min="0" step="1" placeholder="Points"
                                   onChange={e => setBlueScore(parseInt(e.target.value))}/>
                        </label>
                    </div>
                </div>
                {error()}
                <button type="submit" className='submitButton'>Enter game</button>
            </form>
        </div>
    );
}