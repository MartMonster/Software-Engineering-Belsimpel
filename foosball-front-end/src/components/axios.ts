// import React from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://80.114.180.163:8000';

async function cookie() {
    let token;
    await axios.get('/sanctum/csrf-cookie')
        .then(response => {
            console.log(response.config.headers.get('X-XSRF-TOKEN'));
            token = response.config.headers.get('X-XSRF-TOKEN');
        })
        .catch(error => {
            console.log(error);
        });
    return token;
}

export async function login(email: string, password: string) {
    await cookie();
    let b: boolean = false;
    await axios.post('/login', {
        headers: {
            Accept: 'application/json'
        },
        email,
        password
    })
    .then(response => {
        if (response.status >= 200 && response.status < 300) {
            console.log(response);
            b = true;
        }
    })
    .catch(error => {
        console.log(error);
        b = false;
    });
    sessionStorage.setItem('loggedIn', b.toString());
    await getIsAdmin();
    return b;
}

export async function register(email: string, username: string, name: string, lastname: string, password: string, password_confirmation:string) {
    await cookie();
    let b: boolean = false;
    await axios.post('/register', {
        headers: {
            Accept: 'application/json'
        },
        email,
        username,
        name,
        lastname,
        password,
        password_confirmation
    })
    .then(response => {
        if (response.status >= 200 && response.status < 300) {
            console.log(response);
            b = true;
        }
    })
    .catch(error => {
        console.log(error);
        b = false;
    });
    sessionStorage.setItem('loggedIn', b.toString());
    await getIsAdmin();
    return b;
}

export async function logout() {
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('isAdmin');
    await axios.post('/logout', {
        headers: {
            Accept: 'application/json'
        }
    })
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
}


export async function getIsAdmin() {
    let b: boolean = false;
    await axios.get('/admin', {
        headers: {
            Accept: 'application/json'
        }
    }).then(response => {
        console.log(response.data);
        b = response.data === 1;
    }).catch(error => {
        console.log(error);
        b = false;
    });
    sessionStorage.setItem('isAdmin', b.toString());
    return b;
}

interface UserSummary {
    username: string;
    position: number;
    elo: number;
}

export async function getUserSummary() {
    let data: UserSummary | undefined;
    await axios.get('/user/summary', {
        headers: {
            Accept: 'application/json'
        }
    })
    .then(response => {
        console.log(response.data);
        data = response.data;
    })
    .catch(error => {
        console.log(error);
    });
    return data;
}

export interface User{
    id:number,
    username:string,
    elo:number
}

export async function getTop10Users() {
    let users:User[] | undefined;
    await axios.get('/user', {
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
    });
    return users;
}

export interface Team{
    id:number,
    team_name:string,
    player1_username:string,
    player2_username:string,
    elo:number
}

export async function getTop10Teams() {
    let teams:Team[] | undefined;
    await axios.get('/teams', {
        headers: {
            Accept: 'application/json'
        }
    })
    .then(response => {
        console.log(response);
        teams = response.data;
    })
    .catch(error => {
        console.log(error);
    });
    return teams;
}

export interface Game1v1 {
    id: number,
    player1_username: string,
    player2_username: string,
    player1_score: number,
    player2_score: number
}

export interface PaginateInfo {
    current_page: number,
    last_page: number,
}

export async function getLast10Games1v1(page:number = 1) {
    let games:Game1v1[] | undefined;
    let pagination:PaginateInfo;
    let currentPage = 1;
    let lastPage = 1;
    await axios.get(`/games1v1?page=${page}`, {
        headers: {
            Accept: 'application/json'
        }
    })
    .then(response => {
        console.log(response);
        games = response.data.data;
        currentPage = response.data.current_page;
        lastPage = response.data.last_page;
    })
    .catch(error => {
        console.log(error);
    });
    pagination = {current_page: currentPage, last_page: lastPage};
    return {games, pagination};
}

export async function getOwnGames1v1() {
    let games:Game1v1[] | undefined;
    await axios.get('/games1v1/self', {
        headers: {
            Accept: 'application/json'
        }
    })
    .then(response => {
        console.log(response);
        games = response.data.data;
    })
    .catch(error => {
        console.log(error);
    });
    return games;
}

export interface Game2v2 {
    id: number,
    team1_name: string,
    team2_name: string,
    team1_score: number,
    team2_score: number
}

export async function getLast10Games2v2() {
    let games:Game2v2[] | undefined;
    await axios.get('/games2v2', {
        headers: {
            Accept: 'application/json'
        }
    })
    .then(response => {
        console.log(response);
        games = response.data.data;
    })
    .catch(error => {
        console.log(error);
    });
    return games;
}

export async function getOwnGames2v2() {
    let games:Game2v2[] | undefined;
    await axios.get('/games2v2/self', {
        headers: {
            Accept: 'application/json'
        }
    })
    .then(response => {
        console.log(response);
        games = response.data.data;
    })
    .catch(error => {
        console.log(error);
    });
    return games;
}

export async function getOwnTeams() {
    let teams:Team[] | undefined;
    await axios.get('/teams/self', {
        headers: {
            Accept: 'application/json'
        }
    })
    .then(response => {
        console.log(response);
        teams = response.data.data;
    })
    .catch(error => {
        console.log(error);
    });
    return teams;
}

export async function makeGame1v1(player2_username:string, player1_score:number, player2_score:number, player1_side:number) {
    let b:boolean = false;
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
        console.log(response);
        if (response.status >= 200 && response.status < 300) {
            b = true;
        }
    })
    .catch(error => {
        console.log(error);
    })
    return b;
}

export async function makeGame2v2(player2_username:string, player3_username:string, player4_username:string, team1_score:number, team2_score:number, side:number) {
    let b:boolean = false;
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
        console.log(response);
        if (response.status >= 200 && response.status < 300) {
            b = true;
        }
    })
    .catch(error => {
        console.log(error);
    })
    return b;
}

export async function makeTeam(team_name:string, player2_username:string) {
    let b:boolean = false;
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
        }
    })
    .catch(error => {
        console.log(error);
    })
    return b;
}

export async function editGame1v1(id:number, player1_score:number, player2_score:number, player1_side:number) {
    let b:boolean = false;
    await axios.put('games1v1/'+id, {
        headers: {
            Accept: 'application/json'
        },
        player1_score,
        player2_score,
        player1_side
    })
    .then(response => {
        console.log(response);
        if (response.status >= 200 && response.status < 300) {
            b = true;
        }
    })
    .catch(error => {
        console.log(error);
    })
    return b;
}

export async function deleteGame1v1(id:number) {
    let b:boolean = false;
    await axios.delete('games1v1/'+id, {
        headers: {
            Accept: 'application/json'
        }
    })
    .then(response => {
        console.log(response);
        if (response.status >= 200 && response.status < 300) {
            b = true;
        }
    })
    .catch(error => {
        console.log(error);
    })
    return b;
}

export async function editGame2v2(id:number, team1_score:number, team2_score:number, side:number) {
    let b:boolean = false;
    await axios.put('games2v2/'+id, {
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
        }
    })
    .catch(error => {
        console.log(error);
    });
    return b;
}

export async function deleteGame2v2(id:number) {
    let b:boolean = false;
    await axios.delete('games2v2/'+id, {
        headers: {
            Accept: 'application/json'
        }
    })
    .then(response => {
        console.log(response);
        if (response.status >= 200 && response.status < 300) {
            b = true;
        }
    })
    .catch(error => {
        console.log(error);
    });
    return b;
}

export async function editTeam(id:number, team_name:string) {
    let b:boolean = false;
    await axios.put('teams/'+id, {
        headers: {
            Accept: 'application/json'
        },
        team_name
    })
    .then(response => {
        console.log(response);
        if (response.status >= 200 && response.status < 300) {
            b = true;
        }
    })
    .catch(error => {
        console.log(error);
    });
    return b;
}

export async function deleteTeam(id:number) {
    let b:boolean = false;
    await axios.delete('teams/'+id, {
        headers: {
            Accept: 'application/json'
        }
    })
    .then(response => {
        console.log(response);
        if (response.status >= 200 && response.status < 300) {
            b = true;
        }
    })
    .catch(error => {
        console.log(error);
    });
    return b;
}