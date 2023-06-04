import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';

async function cookie(setErrorMessage: (string: string) => void) {
    let token;
    await axios.get('/sanctum/csrf-cookie')
        .then(response => {
            token = response.config.headers.get('X-XSRF-TOKEN');
            setErrorMessage("");
        })
        .catch(error => {
            if (error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage(error.response.data);
            }
        });
    return token;
}

export async function login(email: string, password: string, setErrorMessage: (string: string) => void) {
    await cookie(setErrorMessage);
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
            b = false;
        });
    sessionStorage.setItem('loggedIn', b.toString());
    await getIsAdmin();
    return b;
}

export async function register(email: string, username: string, name: string, lastname: string,
                               password: string, password_confirmation: string, setErrorMessage: (string: string) => void) {
    await cookie(setErrorMessage);
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
        .then(() => {
        })
        .catch(error => {
            if (error.response.status === 401 &&
                (error.response.data.message === "Unauthenticated." || error.response.data === "Unauthenticated.")) {
                sessionStorage.removeItem('loggedIn');
                sessionStorage.removeItem('isAdmin');
            }
        });
}

export async function forgotPassword(email: string, setErrorMessage: (string: string) => void) {
    await cookie(setErrorMessage);
    let b: boolean = false;
    await axios.post('/forgot-password', {
        headers: {
            Accept: 'application/json'
        },
        email
    })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                b = true;
            }
        })
        .catch(error => {
            if (error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage(error.response.data);
            }
        });
    return b;
}

export async function resetPassword(email: string, password: string, password_confirmation: string,
                                    token: string, setErrorMessage: (string: string) => void) {
    await cookie(setErrorMessage);
    let b: boolean = false;
    await axios.post('/reset-password', {
        headers: {
            Accept: 'application/json'
        },
        email,
        password,
        password_confirmation,
        token
    })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                b = true;
            }
        })
        .catch(error => {
            if (error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage(error.response.data);
            }
        });
    return b;
}

export async function getIsAdmin() {
    let b: boolean = false;
    await axios.get('/admin', {
        headers: {
            Accept: 'application/json'
        }
    }).then(response => {
        b = response.data === 1;
        sessionStorage.setItem('isAdmin', b.toString());
    }).catch(error => {
        if (error.response.status === 401 &&
            (error.response.data.message === "Unauthenticated." || error.response.data === "Unauthenticated.")) {
            sessionStorage.removeItem('loggedIn');
        }
        sessionStorage.removeItem('isAdmin');
        b = false;
    });
    return b;
}