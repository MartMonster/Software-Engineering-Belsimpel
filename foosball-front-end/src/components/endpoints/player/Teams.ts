import axios from 'axios';
import { PaginateInfo } from '../../paginate';

export interface Team {
    id: number,
    team_name: string,
    player1_username: string,
    player2_username: string,
    elo: number
}

export async function getTop10Teams(setErrorMessage: (string: string) => void) {
    let teams: Team[] = [];
    await axios.get('/teams', {
        headers: {
            Accept: 'application/json'
        }
    })
        .then(response => {
            teams = response.data;
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
        });
    return teams;
}

export async function getOwnTeams(page: number = 1, setErrorMessage: (string: string) => void) {
    let teams: Team[] = [];
    let pagination: PaginateInfo;
    let currentPage = 1;
    let lastPage = 1;
    await axios.get(`/teams/self?page=${page}`, {
        headers: {
            Accept: 'application/json'
        }
    })
        .then(response => {
            console.log(response);
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
            console.log(error);
            if (error.response.status === 401 &&
                (error.response.data.message === "Unauthenticated." || error.response.data === "Unauthenticated.")) {
                sessionStorage.removeItem('loggedIn');
                sessionStorage.removeItem('isAdmin');
                window.location.reload();
            }
        });
    pagination = { current_page: currentPage, last_page: lastPage };
    return { teams, pagination };
}

export async function makeTeam(team_name: string, player2_username: string, setErrorMessage: (string: string) => void) {
    let b: boolean = false;
    await axios.post('teams', {
        headers: {
            Accept: 'application/json'
        },
        team_name,
        player2_username
    })
        .then(response => {
            console.log(response);
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
            console.log(error);
            if (error.response.status === 401 &&
                (error.response.data.message === "Unauthenticated." || error.response.data === "Unauthenticated.")) {
                sessionStorage.removeItem('loggedIn');
                sessionStorage.removeItem('isAdmin');
                window.location.reload();
            }
        })
    return b;
}

export async function editTeam(id: number, team_name: string, setErrorMessage: (string: string) => void) {
    let b: boolean = false;
    await axios.put('teams/' + id, {
        headers: {
            Accept: 'application/json'
        },
        team_name
    })
        .then(response => {
            console.log(response);
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
            console.log(error);
            if (error.response.status === 401 &&
                (error.response.data.message === "Unauthenticated." || error.response.data === "Unauthenticated.")) {
                sessionStorage.removeItem('loggedIn');
                sessionStorage.removeItem('isAdmin');
                window.location.reload();
            }
        });
    return b;
}

export async function deleteTeam(id: number, setErrorMessage: (string: string) => void) {
    let b: boolean = false;
    await axios.delete('teams/' + id, {
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
            if (error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage(error.response.data);
            }
            console.log(error);
            if (error.response.status === 401 &&
                (error.response.data.message === "Unauthenticated." || error.response.data === "Unauthenticated.")) {
                sessionStorage.removeItem('loggedIn');
                sessionStorage.removeItem('isAdmin');
                window.location.reload();
            }
        });
    return b;
}

export async function getUsersFromTeam(team_name: string, setErrorMessage: (string: string) => void) {
    let users: string[] = [];
    await axios.get(`/teams/users/${team_name}`, {
        headers: {
            Accept: 'application/json'
        }
    })
        .then(response => {
            console.log(response);
            users = response.data;
        })
        .catch(error => {
            console.log(error);
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
        });
    return users;
}