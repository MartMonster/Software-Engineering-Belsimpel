import axios from 'axios';

export async function makeGame1v1(player1_username: string, player2_username: string, player1_score: number, player2_score: number) {
    let b: boolean = false;
    await axios.post('admin/games1v1', {
        headers: {
            Accept: 'application/json'
        },
        player1_username,
        player2_username,
        player1_score,
        player2_score
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

export async function deleteGame1v1(id: number) {
    let b: boolean = false;
    await axios.delete(`admin/games1v1/${id}`, {
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

export async function makeGame2v2(player1_username: string, player2_username: string, player3_username: string, player4_username: string, team1_score: number, team2_score: number) {
    let b: boolean = false;
    await axios.post('admin/games2v2', {
        headers: {
            Accept: 'application/json'
        },
        player1_username,
        player2_username,
        player3_username,
        player4_username,
        team1_score,
        team2_score
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

export async function deleteGame2v2(id: number) {
    let b: boolean = false;
    await axios.delete(`admin/games2v2/${id}`, {
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