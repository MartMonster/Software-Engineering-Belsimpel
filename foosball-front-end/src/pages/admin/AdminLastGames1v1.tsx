import React, { useState, useEffect } from 'react';
import { getLast10Games1v1, Game1v1 } from '../../components/axios';
import { deleteGame1v1 } from '../../components/admin/Games';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import { editGame1v1Route } from '../EditGame1v1';

export const lastGames1v1Route: string = "LastGames1v1"
export const AdminLastGames1v1 = () => {
    const [games, setGames] = useState<Game1v1[]>([]);
    useEffect(getGames, []);

    function getGames() {
        getLast10Games1v1().then((data) => {
            if (data !== undefined) {
                setGames(data);
                console.log(data);
            }
        });
    }
    
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
        if (await deleteGame1v1(gameId)) {
            getGames();
            closeModal();
        }
    }
    return (
        <div className="App">
            <h1>Last 10 1v1 games</h1>
            <table>
                <thead>
                    <tr>
                        <th>Side</th>
                        <th>Players</th>
                        <th>Scores</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game: Game1v1, index) => {
                        return (
                            <React.Fragment key={index}>
                                <tr>
                                    <td>Red</td>
                                    <td>{game.player1_username}</td>
                                    <td>{game.player1_score}</td>
                                    <td rowSpan={2}>
                                        <Link to={editGame1v1Route + '/' + game.id}>
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
        </div>
    );
}
