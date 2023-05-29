import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../../components/endpoints/player/Users';
import { Link, useSearchParams } from 'react-router-dom';
import Modal from 'react-modal';
import { deleteUser, getTop10Users } from '../../components/endpoints/admin/Users';
import paginationButtons from '../../components/paginate';

export const wallOfFame1v1Route: string = "WallOfFame1v1"
export const AdminWallOfFame1v1 = () => {
    const [users, setUsers] = useState(new Array<User>());
    const [paginateButtons, setPaginateButtons] = useState<(string | number)[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [pageNumber, setPageNumber] = useState(1);
    const [errorMessage, setErrorMessage] = useState("")
    const [deleteErrorMessage, setDeleteErrorMessage] = useState("")
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [userId, setUserId] = useState(0);
    const [username, setUsername] = useState('');
    const [optionsModalIsOpen, setOptionsModalIsOpen] = useState(false);

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
    
    const getUsers = useCallback(() => {
        let page = searchParams.get("page");
        if (page === null) {
            page = "1";
        }
        let pageNumber = parseInt(page);
        setPageNumber(pageNumber);
        getTop10Users(pageNumber, setErrorMessage).then((data) => {
            setUsers(data.users);
            if (pageNumber > data.pagination.last_page || pageNumber < 1) {
                setSearchParams();
            }
            setPaginateButtons(paginationButtons(data.pagination));
            console.log(data);
        });
    }, [searchParams, setSearchParams]);
    
    useEffect(getUsers, [getUsers]);

    async function removeUser() {
        if (await deleteUser(userId, setDeleteErrorMessage)) {
            getUsers();
            closeDeleteModal();
        }
    }

    function openDeleteModal() {
        setDeleteModalIsOpen(true);
        setOptionsModalIsOpen(false);
    }

    function closeDeleteModal() {
        setDeleteModalIsOpen(false);
    }

    function openOptionsModal(id: number, name: string) {
        setUserId(id);
        setUsername(name);
        setOptionsModalIsOpen(true);
    }

    function closeOptionsModal() {
        setOptionsModalIsOpen(false);
    }

    return (
        <div className="App">
            <h1>Wall of fame 1v1</h1>
            <p>Click on a user to edit or delete them.</p>
            {error()}
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
                            <tr key={user.id} onClick={() => openOptionsModal(user.id, user.username)}>
                                <td>{(index + 1)*pageNumber}</td>
                                <td className='WoF1v1'>{user.username}</td>
                                <td>{Math.round(user.elo)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Modal className="Modal" isOpen={optionsModalIsOpen} overlayClassName="Overlay"
                onRequestClose={closeOptionsModal}>
                <h2>Options for user: {username}</h2>
                <div className="row">
                    <div className='left-3'>
                        <button onClick={closeOptionsModal}>Close</button>
                    </div>
                    <div className='middle-3'>
                        <Link to={`/admin/user/edit/${userId}?username=${username}`}>
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
                <h2>Are you sure you want to delete this user?</h2>
                {deleteError()}
                <div className="row">
                    <div className='left'>
                        <button onClick={closeDeleteModal}>Cancel</button>
                    </div>
                    <div className='right'>
                        <button onClick={removeUser} className='deleteButton'>Delete</button>
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
                                    <Link className='App-link' to={"/admin/" + wallOfFame1v1Route + "?page=" + button}>{button}</Link>
                                </li>
                            );
                        } else {
                            return (
                                <li key={index} className="page-button">
                                    <Link className='App-link' to={"/admin/" + wallOfFame1v1Route + "?page=" + button}>{button}</Link>
                                </li>
                            );
                        }
                    })}
                </ul>
            </div>
        </div>
    );
}
