import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import { ownGames2v2Route } from "./OwnGames2v2";
import { getLast10Games2v2, Game2v2 } from '../components/endpoints/player/axios';
import paginationButtons from '../components/paginate';

export const lastGames2v2Route: string = "LastGames2v2"
export const LastGames2v2 = () => {
    const [games, setGames] = useState<Game2v2[]>([]);
    const [paginateButtons, setPaginateButtons] = useState<(string | number)[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [errorMessage, setErrorMessage] = useState("")
    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])

    const getGames = useCallback(() => {
        let page = searchParams.get("page");
        if (page === null) {
            page = "1";
        }
        let pageNumber = parseInt(page);
        getLast10Games2v2(pageNumber, setErrorMessage).then((data) => {
            setGames(data.games);
            if (pageNumber > data.pagination.last_page || pageNumber < 1) {
                setSearchParams();
            }
            setPaginateButtons(paginationButtons(data.pagination));
            console.log(data);
        });
    }, [searchParams, setSearchParams])

    useEffect(getGames, [getGames]);

    return (
        <div className="App">
            <h1>Last 10 2v2 games</h1>
            <Link className="App-link" to={ownGames2v2Route}>See own games</Link>
            {error()}
            <table>
                <thead>
                    <tr>
                        <th>Side</th>
                        <th>Teams</th>
                        <th>Scores</th>
                    </tr>
                </thead>
                <tbody className='editDeleteGame'>
                    {games.map((game: Game2v2, index) => {
                        return (
                            <React.Fragment key={game.id}>
                                <tr>
                                    <td>Red</td>
                                    <td className='lastGames'>{game.team1_name}</td>
                                    <td>{game.team1_score}</td>
                                </tr>
                                <tr>
                                    <td>Blue</td>
                                    <td className='lastGames'>{game.team2_name}</td>
                                    <td>{game.team2_score}</td>
                                </tr>
                            </React.Fragment>
                        );
                    })
                    }
                </tbody>
            </table>
            <div className="pagination-container">
                <ul className="pagination">
                    {paginateButtons.map((button, index) => {
                        let page = searchParams.get("page");
                        if (button === "...") {
                            return (<li key={index} className="page-nothing">{button}</li>)
                        } else if (button.toString() === page || (page === null && button === 1)) {
                            return (
                                <li key={index} className="page-button-active">
                                    <Link className='App-link' to={"/" + lastGames2v2Route + "?page=" + button}>{button}</Link>
                                </li>
                            );
                        } else {
                            return (
                                <li key={index} className="page-button">
                                    <Link className='App-link' to={"/" + lastGames2v2Route + "?page=" + button}>{button}</Link>
                                </li>
                            );
                        }
                    })}
                </ul>
            </div>
        </div>
    );
}
