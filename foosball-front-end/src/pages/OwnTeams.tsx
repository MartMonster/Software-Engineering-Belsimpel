import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getOwnTeams, Team, deleteTeam } from '../components/axios';
import Modal from 'react-modal';
import { editTeamRoute } from './EditTeam';
import paginationButtons from '../components/paginate';

export const ownTeamsRoute: string = "/Teams";
export const OwnTeams = () => {
    const [paginateButtons, setPaginateButtons] = useState<(string | number)[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const [modalIsOpen, setIsOpen] = useState(false);
    const [teamId, setTeamId] = useState(0);
    function openModal(id: number) {
        setIsOpen(true);
        setTeamId(id);
    }

    function closeModal() {
        setIsOpen(false);
    }

    async function deleteTeamLocal() {
        if (await deleteTeam(teamId)) {
            getTeams();
            closeModal();
        }
    }
    const getTeams = useCallback(() => {
        let page = searchParams.get("page");
        if (page === null) {
            page = "1";
        }
        let pageNumber = parseInt(page);
        getOwnTeams(pageNumber).then(data => {
            setTeams(data.teams);
            if (pageNumber > data.pagination.last_page || pageNumber < 1) {
                setSearchParams();
            }
            setPaginateButtons(paginationButtons(data.pagination));
            console.log(data);
        });
    }, [searchParams, setSearchParams])
    const [teams, setTeams] = useState<Team[]>([]);
    useEffect(getTeams, [getTeams]);
    return (
        <div className="App">
            <h1>Your teams</h1>
            <table>
                <thead>
                    <tr>
                        <th>Team name</th>
                        <th>Players</th>
                        <th>Elo</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team: Team, index) => {
                        return (
                            <tr key={team.id}>
                                <td>{team.team_name}</td>
                                <td>
                                    <div className='tableCol'>
                                        <p>{team.player1_username}</p>
                                        <p>{team.player2_username}</p>
                                    </div>
                                </td>
                                <td>{team.elo}</td>
                                <td>
                                    <Link to={ownTeamsRoute+'/'+editTeamRoute+'/'+team.id}>
                                        <button className='editButton'>Edit</button>
                                    </Link>
                                </td>
                                <td>
                                    <button className='deleteButton' onClick={() => openModal(team.id)}>Delete</button>
                                </td>
                            </tr>
                        );
                    })
                    }
                </tbody>
            </table>
            <Modal className="Modal" isOpen={modalIsOpen} overlayClassName="Overlay"
                onRequestClose={closeModal}>
                <h2>Are you sure you want to delete this team?</h2>
                <div className="row">
                    <div className='left'>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                    <div className='right'>
                        <button onClick={deleteTeamLocal} className='deleteButton'>Delete</button>
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
                                    <Link className='App-link' to={ownTeamsRoute + "?page=" + button}>{button}</Link>
                                </li>
                            );
                        } else {
                            return (
                                <li key={index} className="page-button">
                                    <Link className='App-link' to={ownTeamsRoute + "?page=" + button}>{button}</Link>
                                </li>
                            );
                        }
                    })}
                </ul>
            </div>
        </div>
    );
}
