import axios from 'axios';

let api = axios.create({
    headers: {
        Token: sessionStorage.getItem('auth')
    },
    baseURL: sessionStorage.getItem('apiUrl')
});

export default api;