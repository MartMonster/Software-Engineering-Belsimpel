import axios from 'axios';
import { PaginateInfo, Team } from '../axios';

export async function getTop10Teams(page: number = 1) {
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
            console.log(response);
            teams = response.data.data;
            currentPage = response.data.current_page;
            lastPage = response.data.last_page;
        })
        .catch(error => {
            console.log(error);
        })
    pagination = { current_page: currentPage, last_page: lastPage };
    return {teams, pagination};
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