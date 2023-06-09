import axios from 'axios';
import {Team} from '../player/Teams';
import {PaginateInfo} from '../../paginate';

export async function getTop10Teams(page: number = 1, setErrorMessage: (string: string) => void) {
    let teams: Team[] = [];
    let pagination: PaginateInfo;
    let currentPage = 1;
    let lastPage = 1;
    await axios.get(`admin/teams?page=${page}`, {
        headers: {
            Accept: 'application/json'
        }
    })
        .then(response => {
            teams = response.data.data;
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
            }
        })
    pagination = {current_page: currentPage, last_page: lastPage};
    return {teams, pagination};
}

export async function editTeam(id: number, team_name: string, setErrorMessage: (string: string) => void) {
    let b: boolean = false;
    await axios.put(`admin/teams/${id}`, {
        headers: {
            Accept: 'application/json'
        },
        team_name
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

export async function makeTeam(team_name: string, player1_username: string, player2_username: string, setErrorMessage: (string: string) => void) {
    let b: boolean = false;
    await axios.post('admin/teams', {
        headers: {
            Accept: 'application/json'
        },
        team_name,
        player1_username,
        player2_username
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

export async function deleteTeam(id: number, setErrorMessage: (string: string) => void) {
    let b: boolean = false;
    await axios.delete(`admin/teams/${id}`, {
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