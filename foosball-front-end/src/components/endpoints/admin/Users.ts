import axios from 'axios';
import { User } from '../player/Users';
import { PaginateInfo } from '../../paginate';

export async function getTop10Users(page: number = 1, setErrorMessage: (string: string) => void) {
    let users: User[] = [];
    let pagination: PaginateInfo;
    let currentPage = 1;
    let lastPage = 1;
    await axios.get(`admin/user?page=${page}`, {
        headers: {
            Accept: 'application/json'
        }
    })
        .then(response => {
            users = response.data.data;
            currentPage = response.data.current_page;
            lastPage = response.data.last_page;
            setErrorMessage("");
        })
        .catch(error => {
            if (error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage(error.response.data);
            }
            if (error.response.status === 401 &&
                (error.response.data.message === "Unauthenticated." || error.response.data === "Unauthenticated.")) {
                sessionStorage.removeItem('loggedIn');
                sessionStorage.removeItem('isAdmin');
                window.location.reload();
                window.location.reload();
            }
        })
    pagination = { current_page: currentPage, last_page: lastPage };
    return { users, pagination };
}


export async function editPlayer(id: number, username: string, setErrorMessage: (string: string) => void) {
    let b: boolean = false;
    await axios.put(`admin/user/${id}`, {
        headers: {
            Accept: 'application/json'
        },
        username
    })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                b = true;
                setErrorMessage("");
            }
        })
        .catch(error => {
            if (error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage(error.response.data);
            }
            if (error.response.status === 401 &&
                (error.response.data.message === "Unauthenticated." || error.response.data === "Unauthenticated.")) {
                sessionStorage.removeItem('loggedIn');
                sessionStorage.removeItem('isAdmin');
                window.location.reload();
            }
        })
    return b;
}

export async function deleteUser(id: number, setErrorMessage: (string: string) => void) {
    let b: boolean = false;
    await axios.delete(`admin/user/${id}`, {
        headers: {
            Accept: 'application/json'
        }
    })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                b = true;
                setErrorMessage("");
            }
        })
        .catch(error => {
            if (error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage(error.response.data);
            }
            if (error.response.status === 401 &&
                (error.response.data.message === "Unauthenticated." || error.response.data === "Unauthenticated.")) {
                sessionStorage.removeItem('loggedIn');
                sessionStorage.removeItem('isAdmin');
                window.location.reload();
            }
        })
    return b;
}