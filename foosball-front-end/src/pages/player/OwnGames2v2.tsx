import React, {useCallback, useEffect, useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import {deleteGame2v2, Game2v2, getOwnGames2v2} from '../../components/endpoints/player/Games';
import {editGame2v2Route} from './EditGame2v2';
import {lastGames2v2Route} from './LastGames2v2';
import Modal from 'react-modal';
import paginationButtons from '../../components/paginate';

Modal.setAppElement('html');
export const ownGames2v2Route: string = "self";
export const OwnGames2v2 = () => {
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [paginateButtons, setPaginateButtons] = useState<(string | number)[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [errorMessage, setErrorMessage] = useState("");
    const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
    const [gameId, setGameId] = useState(0);
    const [games, setGames] = useState<Game2v2[]>([]);
    const [optionsModalIsOpen, setOptionsModalIsOpen] = useState(false);
    const [modalText, setModalText] = useState('');
    const [team1Name, setTeam1Name] = useState("");
    const [team1Score, setTeam1Score] = useState(0);
    const [team2Score, setTeam2Score] = useState(0);

    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])

    const deleteError = useCallback(() => {
        if (deleteErrorMessage !== "") {
            return <p className='errorMessage'>{deleteErrorMessage.toString()}</p>
        }
    }, [deleteErrorMessage])

    const getGames = useCallback(() => {
        let page = searchParams.get("page");
        if (page === null) {
            page = "1";
        }
        let pageNumber = parseInt(page);
        getOwnGames2v2(pageNumber, setErrorMessage).then((data) => {
            setGames(data.games);
            if (pageNumber > data.pagination.last_page || pageNumber < 1) {
                setSearchParams();
            }
            setPaginateButtons(paginationButtons(data.pagination));
            if (data.games.length === 0) {
                setErrorMessage("No games found.");
            }
        });
    }, [searchParams, setSearchParams])

    useEffect(getGames, [getGames]);

    async function deleteGame() {
        if (await deleteGame2v2(gameId, setDeleteErrorMessage)) {
            getGames();
            closeDeleteModal();
        }
    }

    function openDeleteModal() {
        setDeleteModalIsOpen(true);
        setOptionsModalIsOpen(false);
    }

    function closeDeleteModal() {
        setDeleteModalIsOpen(false);
        setDeleteErrorMessage("");
    }

    function openOptionsModal(id: number, text: string, team1_name: string, team1_score: number, team2_score: number) {
        setGameId(id);
        setModalText(text);
        setTeam1Name(team1_name);
        setTeam1Score(team1_score);
        setTeam2Score(team2_score);
        setOptionsModalIsOpen(true);
    }

    function closeOptionsModal() {
        setOptionsModalIsOpen(false);
    }

    return (
        <div className="App">
            <h1>Your last 2v2 games</h1>
            <p>Click on a game to edit or delete it.</p>
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
                        <React.Fragment key={index}>
                            <tr className='redRow'
                                onClick={() => openOptionsModal(game.id, `${game.team1_name} vs ${game.team2_name}`,
                                    game.team1_name, game.team1_score, game.team2_score)}>
                                <td>Red</td>
                                <td className='lastGames'>{game.team1_name}</td>
                                <td>{game.team1_score}</td>
                            </tr>
                            <tr className='blueRow'
                                onClick={() => openOptionsModal(game.id, `${game.team1_name} vs ${game.team2_name}`,
                                    game.team1_name, game.team1_score, game.team2_score)}>
                                <td>Blue</td>
                                <td className='lastGames'>{game.team2_name}</td>
                                <td>{game.team2_score}</td>
                            </tr>
                        </React.Fragment>
                    );
                })}
                </tbody>
            </table>
            {error()}
            <Modal className="Modal" isOpen={optionsModalIsOpen} overlayClassName="Overlay"
                   onRequestClose={closeOptionsModal}>
                <h2>Options for game: {modalText}</h2>
                <div className="row">
                    <div className='left-3'>
                        <button onClick={closeOptionsModal}>Close</button>
                    </div>
                    <div className='middle-3'>
                        <Link
                            to={`/${lastGames2v2Route}/${editGame2v2Route}/${gameId}?team1=${team1Name}&score1=${team1Score}&score2=${team2Score}`}>
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
                {deleteError()}
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
                                    <Link className='App-link'
                                          to={'/' + lastGames2v2Route + '/' + ownGames2v2Route + "?page=" + button}>{button}</Link>
                                </li>
                            );
                        } else {
                            return (
                                <li key={index} className="page-button">
                                    <Link className='App-link'
                                          to={'/' + lastGames2v2Route + '/' + ownGames2v2Route + "?page=" + button}>{button}</Link>
                                </li>
                            );
                        }
                    })}
                </ul>
            </div>
        </div>
    );
}
