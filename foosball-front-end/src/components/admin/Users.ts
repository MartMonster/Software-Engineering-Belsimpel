import axios from 'axios';
import { PaginateInfo, User } from '../axios';

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
            console.log(response);
            users = response.data.data;
            currentPage = response.data.current_page;
            lastPage = response.data.last_page;
            setErrorMessage("");
        })
        .catch(error => {
            setErrorMessage(error.response.data.message);
            console.log(error);
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
            console.log(response);
            if (response.status >= 200 && response.status < 300) {
                b = true;
                setErrorMessage("");
            }
        })
        .catch(error => {
            setErrorMessage(error.response.data.message);
            console.log(error);
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
            console.log(response);
            if (response.status >= 200 && response.status < 300) {
                b = true;
                setErrorMessage("");
            }
        })
        .catch(error => {
            setErrorMessage(error.response.data.message);
            console.log(error);
        })
    return b;
}