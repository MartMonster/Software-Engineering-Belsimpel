import React, { useState, useEffect, useCallback } from 'react';
import { getTop10Users, User } from '../../components/axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { deleteUser } from '../../components/admin/Users';

export const wallOfFame1v1Route: string = "WallOfFame1v1"
export const AdminWallOfFame1v1 = () => {
    const [users, setUsers] = useState(new Array<User>());
    const getUsers = useCallback(() => {
        getTop10Users().then((data) => {
            if (data !== undefined) {
                setUsers(data);
                console.log(data);
            }
        });
    }, [setUsers]);
    
    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const [modalIsOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState(0);
    function openModal(id: number) {
        setIsOpen(true);
        setUserId(id);
    }

    function closeModal() {
        setIsOpen(false);
    }

    async function removeUser() {
        if (await deleteUser(userId)) {
            getUsers();
            closeModal();
        }
    }
    return (
        <div className="App">
            <h1>Wall of fame 1v1</h1>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Elo</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user: User, index) => {
                        return (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.elo}</td>
                                <td>
                                    <Link to={`/admin/user/edit/${user.id}`}>
                                        <button className='editButton'>Edit</button>
                                    </Link>
                                </td>
                                <td>
                                    <button className='deleteButton' onClick={() => openModal(user.id)}>Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Modal className="Modal" isOpen={modalIsOpen} overlayClassName="Overlay"
                onRequestClose={closeModal}
                contentLabel="Example Modal">
                <h2>Are you sure you want to delete this user?</h2>
                <div className="row">
                    <div className='left'>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                    <div className='right'>
                        <button onClick={removeUser} className='deleteButton'>Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
