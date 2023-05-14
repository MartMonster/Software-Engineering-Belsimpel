import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getOwnGames1v1, Game1v1, deleteGame1v1 } from '../components/axios';
import { editGame1v1Route } from './EditGame1v1';
import { lastGames1v1Route } from './LastGames1v1';
import Modal from 'react-modal';
import paginationButtons from '../components/paginate';

Modal.setAppElement('html');
export const ownGames1v1Route: string = "self";
export const OwnGames1v1 = () => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [gameId, setGameId] = useState(0);
    const [paginateButtons, setPaginateButtons] = useState<(string | number)[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();

    function openModal(id:number) {
        setIsOpen(true);
        setGameId(id);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const [games, setGames] = useState<Game1v1[]>([]);
    const getGames = useCallback (() => {
        let page = searchParams.get("page");
        if (page === null) {
            page = "1";
        }
        let pageNumber = parseInt(page);
        getOwnGames1v1(pageNumber).then((data) => {
            setGames(data.games);
            if (pageNumber > data.pagination.last_page || pageNumber < 1) {
                setSearchParams();
            }
            setPaginateButtons(paginationButtons(data.pagination));
            console.log(data);
        });
    }, [searchParams, setSearchParams])

    useEffect(getGames, [getGames]);

    async function deleteGame() {
        if(await deleteGame1v1(gameId)) {
            getGames();
            closeModal();
        }
    }
    return (
        <div className="App">
            <h1>Your last 10 1v1 games</h1>
            <table className="outerTable">
                <thead>
                    <tr>
                        <th>Side</th>
                        <th>Players</th>
                        <th>Scores</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game:Game1v1, index) => {
                        return (
                            <React.Fragment key={index}>
                                <tr>
                                    <td>Red</td>
                                    <td>{game.player1_username}</td>
                                    <td>{game.player1_score}</td>
                                    <td rowSpan={2}>
                                        <Link to={'/' + lastGames1v1Route + '/' + editGame1v1Route + '/' + game.id}>
                                            <button className='editButton'>Edit</button>
                                        </Link>
                                    </td>
                                    <td rowSpan={2}>
                                        <button className='deleteButton' onClick={() => openModal(game.id)}>Delete</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Blue</td>
                                    <td>{game.player2_username}</td>
                                    <td>{game.player2_score}</td>
                                </tr>
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
            <Modal className="Modal" isOpen={modalIsOpen} overlayClassName="Overlay"
                onRequestClose={closeModal}
                contentLabel="Example Modal">
                <h2>Are you sure you want to delete this game?</h2>
                <div className="row">
                    <div className='left'>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                    <div className='right'>
                        <button onClick={deleteGame} className='deleteButton'>Delete</button>
                    </div>
                </div>
            </Modal>
            <div className="pagination-container">
                <ul className="pagination">
                    {paginateButtons.map((button, index) => {
                        let page = searchParams.get("page");
                        if (button === "...") {
                            return (<li key={index} className="page-nothing">{button}</li>)
                        } else if (button.toString() === page || (page === null && button === 1)) {
                            return (
                                <li key={index} className="page-button-active">
                                    <Link className='App-link' to={'/' + lastGames1v1Route+ '/' + ownGames1v1Route + "?page=" + button}>{button}</Link>
                                </li>
                            );
                        } else {
                            return (
                                <li key={index} className="page-button">
                                    <Link className='App-link' to={'/' + lastGames1v1Route + '/' + ownGames1v1Route + "?page=" + button}>{button}</Link>
                                </li>
                            );
                        }
                    })}
                </ul>
            </div>
        </div>
    );
}
