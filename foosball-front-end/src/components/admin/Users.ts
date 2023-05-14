import axios from 'axios';
import { User } from '../axios';

export async function getTop10Users() {
    let users: User[] = [];
    await axios.get('admin/user', {
        headers: {
            Accept: 'application/json'
        }
    })
        .then(response => {
            console.log(response);
            users = response.data.data;
        })
        .catch(error => {
            console.log(error);
        })
    return users;
}

export async function editPlayer(id:number, username:string) {
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
            }
        })
        .catch(error => {
            console.log(error);
        })
    return b;
}

export async function deleteUser(id:number){
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
            }
        })
        .catch(error => {
            console.log(error);
        })
    return b;
}