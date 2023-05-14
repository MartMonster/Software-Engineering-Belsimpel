import React, { useState, useEffect, useCallback } from 'react';
import { Team } from '../../components/axios';
import { deleteTeam, getTop10Teams } from '../../components/admin/Teams';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

export const wallOfFame2v2Route: string = "WallOfFame2v2"
export const AdminWallOfFame2v2 = () => {
    const [teams, setTeams] = useState(new Array<Team>());
    const getTeams = useCallback(() => {
        getTop10Teams().then((data) => {
            setTeams(data);
            console.log(data);
        });
    }, [setTeams]);
    useEffect(() => {
        getTeams();
    }, [getTeams]);

    const [modalIsOpen, setIsOpen] = useState(false);
    const [teamId, setTeamId] = useState(0);
    function openModal(id: number) {
        setIsOpen(true);
        setTeamId(id);
    }

    function closeModal() {
        setIsOpen(false);
    }

    async function removeTeam() {
        if (await deleteTeam(teamId)) {
            getTeams();
            closeModal();
        }
    }
    return (
        <div className="App">
            <h1>Wall of fame 2v2</h1>
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
                            <tr key={team.id}>
                                <td>{index + 1}</td>
                                <td>{team.team_name}</td>
                                <td>
                                    <div className="tableCol">
                                        <p>{team.player1_username}</p>
                                        <p>{team.player2_username}</p>
                                    </div>
                                </td>
                                <td>{team.elo}</td>
                                <td>
                                    <Link to={`/admin/teams/edit/${team.id}`}>
                                        <button className='editButton'>Edit</button>
                                    </Link>
                                </td>
                                <td>
                                    <button className='deleteButton' onClick={() => openModal(team.id)}>Delete</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Modal className="Modal" isOpen={modalIsOpen} overlayClassName="Overlay"
                onRequestClose={closeModal}
                contentLabel="Example Modal">
                <h2>Are you sure you want to delete this team?</h2>
                <div className="row">
                    <div className='left'>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                    <div className='right'>
                        <button onClick={removeTeam} className='deleteButton'>Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
