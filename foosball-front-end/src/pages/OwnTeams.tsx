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
    const [pageNumber, setPageNumber] = useState(1);
    const [errorMessage, setErrorMessage] = useState("")
    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])
    const [deleteErrorMessage, setDeleteErrorMessage] = useState("")
    const deleteError = useCallback(() => {
        if (deleteErrorMessage !== "") {
            return <p className='errorMessage'>{deleteErrorMessage.toString()}</p>
        }
    }, [deleteErrorMessage])

    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [teamId, setTeamId] = useState(0);
    function openDeleteModal() {
        setDeleteModalIsOpen(true);
        setOptionsModalIsOpen(false);
    }

    function closeModal() {
        setDeleteModalIsOpen(false);
    }

    async function deleteTeamLocal() {
        if (await deleteTeam(teamId, setDeleteErrorMessage)) {
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
        setPageNumber(pageNumber);
        getOwnTeams(pageNumber, setErrorMessage).then(data => {
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

    const [optionsModalIsOpen, setOptionsModalIsOpen] = useState(false);
    const [teamName, setTeamName] = useState('');
    function openOptionsModal(id: number, name: string) {
        setTeamId(id);
        setTeamName(name);
        setOptionsModalIsOpen(true);
    }

    function closeOptionsModal() {
        setOptionsModalIsOpen(false);
    }
    return (
        <div className="App">
            <h1>Your teams</h1>
            <p>Click on a team to edit or delete it.</p>
            {error()}
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Team name</th>
                        <th>Players</th>
                        <th>Elo</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team: Team, index) => {
                        return (
                            <tr key={team.id} onClick={() => openOptionsModal(team.id, team.team_name)}>
                                <td>{(index + 1) * pageNumber}</td>
                                <td className='teamName'>{team.team_name}</td>
                                <td>
                                    <div className="tableCol">
                                        <p className='WoF2v2'>{team.player1_username}</p>
                                        <p className='WoF2v2'>{team.player2_username}</p>
                                    </div>
                                </td>
                                <td>{Math.round(team.elo)}</td>
                            </tr>
                        );
                    })
                    }
                </tbody>
            </table>
            <Modal className="Modal" isOpen={optionsModalIsOpen} overlayClassName="Overlay"
                onRequestClose={closeOptionsModal}>
                <h2>Options for team: {teamName}</h2>
                <div className="row">
                    <div className='left-3'>
                        <button onClick={closeOptionsModal}>Close</button>
                    </div>
                    <div className='middle-3'>
                        <Link to={`${ownTeamsRoute}/${editTeamRoute}/${teamId}?team=${teamName}`}>
                            <button className='editButton'>Edit</button>
                        </Link>
                    </div>
                    <div className='right-3'>
                        <button onClick={() => openDeleteModal()} className='deleteButton'>Delete</button>
                    </div>
                </div>
            </Modal>
            <Modal className="Modal" isOpen={deleteModalIsOpen} overlayClassName="Overlay"
                onRequestClose={closeModal}>
                <h2>Are you sure you want to delete this team?</h2>
                {deleteError()}
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
