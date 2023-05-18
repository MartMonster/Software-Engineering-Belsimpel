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
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [gameId, setGameId] = useState(0);
    const [paginateButtons, setPaginateButtons] = useState<(string | number)[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();

    function openDeleteModal() {
        setDeleteModalIsOpen(true);
        setOptionsModalIsOpen(false);
    }

    function closeDeleteModal() {
        setDeleteModalIsOpen(false);
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
            closeDeleteModal();
        }
    }

    const [optionsModalIsOpen, setOptionsModalIsOpen] = useState(false);
    const [modalText, setModalText] = useState('');
    function openOptionsModal(id: number, text: string) {
        setGameId(id);
        setModalText(text);
        setOptionsModalIsOpen(true);
    }

    function closeOptionsModal() {
        setOptionsModalIsOpen(false);
    }
    return (
        <div className="App">
            <h1>Your last 10 1v1 games</h1>
            <p>Click on a game to edit or delete it.</p>
            <table>
                <thead>
                    <tr>
                        <th>Side</th>
                        <th>Players</th>
                        <th>Scores</th>
                    </tr>
                </thead>
                <tbody className='editDeleteGame'>
                    {games.map((game:Game1v1, index) => {
                        return (
                            <React.Fragment key={index}>
                                <tr onClick={() => openOptionsModal(game.id, `${game.player1_username} vs ${game.player2_username}`)}>
                                    <td>Red</td>
                                    <td className='lastGames'>{game.player1_username}</td>
                                    <td>{game.player1_score}</td>
                                </tr>
                                <tr onClick={() => openOptionsModal(game.id, `${game.player1_username} vs ${game.player2_username}`)}>
                                    <td>Blue</td>
                                    <td className='lastGames'>{game.player2_username}</td>
                                    <td>{game.player2_score}</td>
                                </tr>
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
            <Modal className="Modal" isOpen={optionsModalIsOpen} overlayClassName="Overlay"
                onRequestClose={closeOptionsModal}>
                <h2>Options for game: {modalText}</h2>
                <div className="row">
                    <div className='left-3'>
                        <button onClick={closeOptionsModal}>Close</button>
                    </div>
                    <div className='middle-3'>
                        <Link to={`/${lastGames1v1Route}/${editGame1v1Route}/${gameId}`}>
                            <button className='editButton'>Edit</button>
                        </Link>
                    </div>
                    <div className='right-3'>
                        <button onClick={() => openDeleteModal()} className='deleteButton'>Delete</button>
                    </div>
                </div>
            </Modal>
            <Modal className="Modal" isOpen={deleteModalIsOpen} overlayClassName="Overlay"
                onRequestClose={closeDeleteModal}
                contentLabel="Example Modal">
                <h2>Are you sure you want to delete this game?</h2>
                <div className="row">
                    <div className='left'>
                        <button onClick={closeDeleteModal}>Cancel</button>
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
