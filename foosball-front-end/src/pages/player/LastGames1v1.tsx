import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import { ownGames1v1Route } from "./OwnGames1v1";
import { getLast10Games1v1, Game1v1 } from '../../components/endpoints/player/Games';
import paginationButtons from '../../components/paginate';

export const lastGames1v1Route: string = "LastGames1v1"
export const LastGames1v1 = () => {
    const [games, setGames] = useState<Game1v1[]>([]);
    const [paginateButtons, setPaginateButtons] = useState<(string | number)[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [errorMessage, setErrorMessage] = useState("");

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
        getLast10Games1v1(pageNumber, setErrorMessage).then((data) => {
            setGames(data.games);
            if (pageNumber > data.pagination.last_page || pageNumber < 1) {
                setSearchParams();
            }
            setPaginateButtons(paginationButtons(data.pagination));
            if (data.games.length === 0) {
                setErrorMessage("No games found.");
            }
            console.log(data);
        });
    }, [searchParams, setSearchParams]);

    useEffect(getGames, [getGames]);

    return (
        <div className="App">
            <h1>Last 1v1 games</h1>
            <Link className="App-link" to={ownGames1v1Route}>See own games</Link>
            <table>
                <thead>
                    <tr>
                        <th>Side</th>
                        <th>Players</th>
                        <th>Scores</th>
                    </tr>
                </thead>
                <tbody className='editDeleteGame'>
                    {games.map((game: Game1v1, index) => {
                        return (
                            <React.Fragment key={index}>
                                <tr className='redRow'>
                                    <td>Red</td>
                                    <td className='lastGames'>{game.player1_username}</td>
                                    <td>{game.player1_score}</td>
                                </tr>
                                <tr className='blueRow'>
                                    <td>Blue</td>
                                    <td className='lastGames'>{game.player2_username}</td>
                                    <td>{game.player2_score}</td>
                                </tr>
                            </React.Fragment>
                        );
                    })
                }
                </tbody>
            </table>
            {error()}
            <div className="pagination-container">
                <ul className="pagination">
                    {paginateButtons.map((button, index) => {
                        let page = searchParams.get("page");
                        if (button === "...") {
                            return (<li key={index} className="page-nothing">{button}</li>)
                        } else if (button.toString() === page || (page === null && button === 1)) {
                            return (
                                <li key={index} className="page-button-active">
                                    <Link className='App-link' to={"/" + lastGames1v1Route + "?page=" + button}>{button}</Link>
                                </li>
                            );
                        } else {
                            return (
                                <li key={index} className="page-button">
                                    <Link className='App-link' to={"/" + lastGames1v1Route + "?page=" + button}>{button}</Link>
                                </li>
                            );
                        }
                    })}
                </ul>
            </div>
        </div>
    );
}
