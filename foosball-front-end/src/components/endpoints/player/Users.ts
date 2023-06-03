import axios from 'axios';

interface UserSummary {
    username: string;
    position: number;
    elo: number;
}

export async function getUserSummary(setErrorMessage: (string: string) => void) {
    let data: UserSummary = { username: '', position: 0, elo: 0 };
    await axios.get('/user/summary', {
        headers: {
            Accept: 'application/json'
        }
    })
        .then(response => {
            data = response.data;
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
    return data;
}

export interface User {
    id: number,
    username: string,
    elo: number
}

export async function getTop10Users(setErrorMessage: (string: string) => void) {
    let users: User[] = [];
    await axios.get('/user', {
        headers: {
            Accept: 'application/json'
        }
    })
        .then(response => {
            users = response.data;
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
    return users;
}

export async function editUsername(username: string, setErrorMessage: (string: string) => void) {
    let b: boolean = false;
    await axios.put('/user/username', {
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
        });
    return b;
}