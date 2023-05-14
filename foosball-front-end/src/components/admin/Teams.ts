import axios from 'axios';
import { Team } from '../axios';

export async function getTop10Teams() {
    let teams: Team[] = [];
    await axios.get('admin/teams', {
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
        })
    return teams;
}

export async function editTeam(id:number, team_name:string) {
    let b: boolean = false;
    await axios.put(`admin/teams/${id}`, {
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
        })
    return b;
}

export async function makeTeam(team_name: string, player1_username: string, player2_username: string) {
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

export async function deleteTeam(id: number) {
    let b: boolean = false;
    await axios.delete(`admin/teams/${id}`, {
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