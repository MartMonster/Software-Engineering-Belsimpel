import React from 'react';
import axios from 'axios';

async function cookie() {
    axios.defaults.withCredentials = true;
    let token;
    await axios.get('http://localhost:8000/sanctum/csrf-cookie')
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
    axios.defaults.withCredentials = true;
    await cookie();
    let b: boolean = false;
    await axios.post('http://localhost:8000/login', {
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
    return b;
}

export async function logout() {
    axios.defaults.withCredentials = true;
    await axios.post('http://localhost:8000/logout', {
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

export async function getTop10() {
    axios.defaults.withCredentials = true;
    await axios.get('http://localhost:8000/user/top10', {
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