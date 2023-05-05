import React, { useState, useEffect } from 'react';
import { getLast10Games2v2, Game2v2 } from '../../components/axios';
import { deleteGame2v2 } from '../../components/admin/Games';
import { Link } from 'react-router-dom';
import { editGame2v2Route } from '../EditGame2v2';
import Modal from 'react-modal';

export const lastGames2v2Route: string = "LastGames2v2"
export const AdminLastGames2v2 = () => {
    useEffect(getGames, [getGames]);
    const [games, setGames] = useState<Game2v2[]>([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [gameId, setGameId] = useState(0);
    function openModal(id: number) {
        setIsOpen(true);
        setGameId(id);
    }

    function closeModal() {
        setIsOpen(false);
    }

    async function deleteGame() {
        if (await deleteGame2v2(gameId)) {
            getGames();
            closeModal();
        }
    }

    function getGames() {
        getLast10Games2v2().then((data) => {
            if (data !== undefined) {
                setGames(data);
                console.log(data);
            }
        });
    }
    return (
        <div className="App">
            <h1>Last 10 2v2 games</h1>
            <table>
                <thead>
                    <tr>
                        <th>Side</th>
                        <th>Players</th>
                        <th>Scores</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game: Game2v2, index) => {
                        return (
                            <tr key={game.id}>
                                <td>
                                    <div className="tableCol">
                                        <p>Red</p>
                                        <p>Blue</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="tableCol">
                                        <p>{game.team1_name}</p>
                                        <p>{game.team2_name}</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="tableCol">
                                        <p>{game.team1_score}</p>
                                        <p>{game.team2_score}</p>
                                    </div>
                                </td>
                                <td>
                                    <Link to={'/' + lastGames2v2Route + '/' + editGame2v2Route + '/' + game.id}>
                                        <button className='editButton'>Edit</button>
                                    </Link>
                                </td>
                                <td>
                                    <button className='deleteButton' onClick={() => openModal(game.id)}>Delete</button>
                                </td>
                            </tr>
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
        </div>
    );
}
