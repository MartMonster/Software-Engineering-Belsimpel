import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../../components/axios';
import { Link, useSearchParams } from 'react-router-dom';
import Modal from 'react-modal';
import { deleteUser, getTop10Users } from '../../components/admin/Users';
import paginationButtons from '../../components/paginate';

export const wallOfFame1v1Route: string = "WallOfFame1v1"
export const AdminWallOfFame1v1 = () => {
    const [users, setUsers] = useState(new Array<User>());
    const [paginateButtons, setPaginateButtons] = useState<(string | number)[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [pageNumber, setPageNumber] = useState(1);
    
    const getUsers = useCallback(() => {
        let page = searchParams.get("page");
        if (page === null) {
            page = "1";
        }
        let pageNumber = parseInt(page);
        setPageNumber(pageNumber);
        getTop10Users(pageNumber).then((data) => {
            setUsers(data.users);
            if (pageNumber > data.pagination.last_page || pageNumber < 1) {
                setSearchParams();
            }
            setPaginateButtons(paginationButtons(data.pagination));
            console.log(data);
        });
    }, [searchParams, setSearchParams]);
    
    useEffect(getUsers, [getUsers]);

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
                                <td>{(index + 1)*pageNumber}</td>
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
