import axios from 'axios';

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