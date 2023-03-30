// import React from 'react';
import axios from 'axios';

export let loggedIn: boolean = false;
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';

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
    loggedIn = b;
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
    loggedIn = b;
    return b;
}

export async function logout() {
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
    loggedIn = false;
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
    await axios.get('/user/top10', {
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
        teams = response.data.data;
    })
    .catch(error => {
        console.log(error);
    });
    return teams;
}