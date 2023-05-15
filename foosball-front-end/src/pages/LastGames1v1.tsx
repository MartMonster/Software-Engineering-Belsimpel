import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import { ownGames1v1Route } from "./OwnGames1v1";
import { getLast10Games1v1, Game1v1 } from '../components/axios';
import paginationButtons from '../components/paginate';

export const lastGames1v1Route: string = "LastGames1v1"
export const LastGames1v1 = () => {
    const [games, setGames] = useState<Game1v1[]>([]);
    const [paginateButtons, setPaginateButtons] = useState<(string | number)[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const getGames = useCallback(() => {
        let page = searchParams.get("page");
        if (page === null) {
            page = "1";
        }
        let pageNumber = parseInt(page);
        getLast10Games1v1(pageNumber).then((data) => {
            setGames(data.games);
            if (pageNumber > data.pagination.last_page || pageNumber < 1) {
                setSearchParams();
            }
            setPaginateButtons(paginationButtons(data.pagination));
            console.log(data);
        });
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        getGames();
    }, [getGames]);
    return (
        <div className="App">
            <h1>Last 10 1v1 games</h1>
            <Link className="App-link" to={ownGames1v1Route}>See own games</Link>
            <table>
                <thead>
                    <tr>
                        <th>Player Red</th>
                        <th>Player Blue</th>
                        <th>Score Red</th>
                        <th>Score Blue</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game: Game1v1, index) => {
                        return (
                            <tr key={game.id}>
                                <td>{game.player1_username}</td>
                                <td>{game.player2_username}</td>
                                <td>{game.player1_score}</td>
                                <td>{game.player2_score}</td>
                            </tr>
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
