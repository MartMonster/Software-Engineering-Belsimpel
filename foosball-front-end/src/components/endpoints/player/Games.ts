import axios from 'axios';
import { PaginateInfo } from '../../paginate';

export interface Game1v1 {
    id: number,
    player1_username: string,
    player2_username: string,
    player1_score: number,
    player2_score: number
}

export async function getLast10Games1v1(page: number = 1, setErrorMessage: (string: string) => void) {
    let games: Game1v1[] = [];
    let pagination: PaginateInfo;
    let currentPage = 1;
    let lastPage = 1;
    await axios.get(`/games1v1?page=${page}`, {
        headers: {
            Accept: 'application/json'
        }
    })
        .then(response => {
            games = response.data.data;
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
        });
    pagination = { current_page: currentPage, last_page: lastPage };
    return { games, pagination };
}

export async function getOwnGames1v1(page: number = 1, setErrorMessage: (string: string) => void) {
    let games: Game1v1[] = [];
    let pagination: PaginateInfo;
    let currentPage = 1;
    let lastPage = 1;
    await axios.get(`/games1v1/self?page=${page}`, {
        headers: {
            Accept: 'application/json'
        }
    })
        .then(response => {
            games = response.data.data;
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
        });
    pagination = { current_page: currentPage, last_page: lastPage };
    return { games, pagination };
}

export async function makeGame1v1(player2_username: string, player1_score: number | undefined,
    player2_score: number | undefined,
    player1_side: number, setErrorMessage: (string: string) => void) {
    let b: boolean = false;
    await axios.post('games1v1', {
        headers: {
            Accept: 'application/json'
        },
        player2_username,
        player1_score,
        player2_score,
        player1_side
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

export async function editGame1v1(id: number, player1_score: number | undefined,
    player2_score: number | undefined,
    player1_side: number, setErrorMessage: (string: string) => void) {
    let b: boolean = false;
    await axios.put('games1v1/' + id, {
        headers: {
            Accept: 'application/json'
        },
        player1_score,
        player2_score,
        player1_side
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

export async function deleteGame1v1(id: number, setErrorMessage: (string: string) => void) {
    let b: boolean = false;
    await axios.delete('games1v1/' + id, {
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

export interface Game2v2 {
    id: number,
    team1_name: string,
    team2_name: string,
    team1_score: number,
    team2_score: number
}

export async function getLast10Games2v2(page: number = 1, setErrorMessage: (string: string) => void) {
    let games: Game2v2[] = [];
    let pagination: PaginateInfo;
    let currentPage = 1;
    let lastPage = 1;
    await axios.get(`/games2v2?page=${page}`, {
        headers: {
            Accept: 'application/json'
        }
    })
        .then(response => {
            console.log(response);
            games = response.data.data;
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
    return { games, pagination };
}

export async function getOwnGames2v2(page: number = 1, setErrorMessage: (string: string) => void) {
    let games: Game2v2[] = [];
    let pagination: PaginateInfo;
    let currentPage = 1;
    let lastPage = 1;
    await axios.get(`/games2v2/self?page=${page}`, {
        headers: {
            Accept: 'application/json'
        }
    })
        .then(response => {
            console.log(response);
            games = response.data.data;
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
    return { games, pagination };
}

export async function makeGame2v2(player2_username: string, player3_username: string, player4_username: string,
    team1_score: number | undefined, team2_score: number | undefined, side: number, setErrorMessage: (string: string) => void) {
    let b: boolean = false;
    await axios.post('games2v2', {
        headers: {
            Accept: 'application/json'
        },
        player2_username,
        player3_username,
        player4_username,
        team1_score,
        team2_score,
        side
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

export async function editGame2v2(id: number, team1_score: number | undefined,
    team2_score: number | undefined,
    side: number, setErrorMessage: (string: string) => void) {
    let b: boolean = false;
    await axios.put('games2v2/' + id, {
        headers: {
            Accept: 'application/json'
        },
        team1_score,
        team2_score,
        side
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

export async function deleteGame2v2(id: number, setErrorMessage: (string: string) => void) {
    let b: boolean = false;
    await axios.delete('games2v2/' + id, {
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