import React, { useState, useEffect, useCallback } from 'react';
import { Team } from '../../components/axios';
import { deleteTeam, getTop10Teams } from '../../components/admin/Teams';
import { Link, useSearchParams } from 'react-router-dom';
import Modal from 'react-modal';
import paginationButtons from '../../components/paginate';

export const wallOfFame2v2Route: string = "WallOfFame2v2"
export const AdminWallOfFame2v2 = () => {
    const [teams, setTeams] = useState(new Array<Team>());
    const [paginateButtons, setPaginateButtons] = useState<(string | number)[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [pageNumber, setPageNumber] = useState(1);
    
    const getTeams = useCallback(() => {
        let page = searchParams.get("page");
        if (page === null) {
            page = "1";
        }
        let pageNumber = parseInt(page);
        setPageNumber(pageNumber);
        getTop10Teams(pageNumber).then((data) => {
            setTeams(data.teams);
            if (pageNumber > data.pagination.last_page || pageNumber < 1) {
                setSearchParams();
            }
            setPaginateButtons(paginationButtons(data.pagination));
            console.log(data);
        });
    }, [setTeams, searchParams, setSearchParams]);

    useEffect(() => {
        getTeams();
    }, [getTeams]);

    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    
    const [teamId, setTeamId] = useState(0);
    const [teamName, setTeamName] = useState('');

    function openDeleteModal() {
        setOptionsModalIsOpen(false);
        setDeleteModalIsOpen(true);
    }

    function closeDeleteModal() {
        setDeleteModalIsOpen(false);
    }

    async function removeTeam() {
        if (await deleteTeam(teamId)) {
            getTeams();
            closeDeleteModal();
        }
    }

    const [optionsModalIsOpen, setOptionsModalIsOpen] = useState(false);
    function openOptionsModal(id:number, name:string) {
        setTeamId(id);
        setTeamName(name);
        setOptionsModalIsOpen(true);
    }

    function closeOptionsModal() {
        setOptionsModalIsOpen(false);
    }
    return (
        <div className="App">
            <h1>Wall of fame 2v2</h1>
            <p>Click on a team to edit or delete it.</p>
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
                                <td>{(index + 1)*pageNumber}</td>
                                <td className='teamName'>{team.team_name}</td>
                                <td>
                                    <div className="tableCol">
                                        <p className='WoF2v2'>{team.player1_username}</p>
                                        <p className='WoF2v2'>{team.player2_username}</p>
                                    </div>
                                </td>
                                <td>{Math.round(team.elo)}</td>
                            </tr>
                        )
                    })}
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
                        <Link to={`/admin/teams/edit/${teamId}`}>
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
                <h2>Are you sure you want to delete this team?</h2>
                <div className="row">
                    <div className='left'>
                        <button onClick={closeDeleteModal}>Cancel</button>
                    </div>
                    <div className='right'>
                        <button onClick={removeTeam} className='deleteButton'>Delete</button>
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
                                    <Link className='App-link' to={"/admin/" + wallOfFame2v2Route + "?page=" + button}>{button}</Link>
                                </li>
                            );
                        } else {
                            return (
                                <li key={index} className="page-button">
                                    <Link className='App-link' to={"/admin/" + wallOfFame2v2Route + "?page=" + button}>{button}</Link>
                                </li>
                            );
                        }
                    })}
                </ul>
            </div>
        </div>
    );
}
