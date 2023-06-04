import React, {useCallback, useEffect, useState} from 'react';
import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {editGame2v2} from '../../components/endpoints/player/Games';
import {ownGames2v2Route} from './OwnGames2v2';
import {lastGames2v2Route} from './LastGames2v2';
import {getUsersFromTeam} from '../../components/endpoints/player/Teams';

export const editGame2v2Route: string = "edit"
export const EditGame2v2 = () => {
    const idPar = useParams();
    const navigate = useNavigate();
    const [team1, setTeam1] = useState("");
    const [myPoints, setMyPoints] = useState<number>();
    const [opponentPoints, setOpponentPoints] = useState<number>();
    const [side, setSide] = useState(1);
    const [errorMessage, setErrorMessage] = useState("")
    const [searchParams] = useSearchParams();

    let id: number = 0;
    if (idPar) {
        id = idPar.id as unknown as number;
    }

    const navigateToOwnGames = () => {
        navigate('/' + lastGames2v2Route + '/' + ownGames2v2Route);
    }

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

    const getUsers = useCallback(() => {
        if (searchParams.get("team1") as string) {
            setTeam1(searchParams.get("team1") as string);
        }
        if (team1 !== '') {
            getUsersFromTeam(team1, setErrorMessage).then((data) => {
                if (data.length !== 0) {
                    if (data.includes(sessionStorage.getItem("username") as string)) {
                        setSide(1);
                        setMyPoints(parseInt(searchParams.get("score1") as string));
                        setOpponentPoints(parseInt(searchParams.get("score2") as string));
                    } else {
                        setSide(2);
                        setMyPoints(parseInt(searchParams.get("score2") as string));
                        setOpponentPoints(parseInt(searchParams.get("score1") as string));
                    }
                }
            });
        }
    }, [team1, searchParams])

    useEffect(getUsers, [getUsers, searchParams])

    return (
        <div className="App">
            <h1>Edit your 2v2 game</h1>
            <form autoComplete="off" onSubmit={saveGame}>
                <label>
                    What side did you play on?
                    <select value={side.toString()} onChange={e => setSide(parseInt(e.target.value))}>
                        <option value="1">Red</option>
                        <option value="2">Blue</option>
                    </select>
                </label>
                <label>
                    How many points did your team score?
                    <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                           type="number" max="10" min="0" step="1" placeholder="Points" defaultValue={myPoints}
                           onChange={e => setMyPoints(parseInt(e.target.value))}/>
                </label>
                <label>
                    How many points did your opponents score?
                    <input required pattern="\S(.*\S)?" title="Leading and trailing whitespaces are not allowed"
                           type="number" max="10" min="0" step="1" placeholder="Points" defaultValue={opponentPoints}
                           onChange={e => setOpponentPoints(parseInt(e.target.value))}/>
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