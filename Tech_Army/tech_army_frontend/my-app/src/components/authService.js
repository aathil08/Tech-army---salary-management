import config from '../config';
import axios from 'axios';

const API_URL = `${config.API_URL}`;

const authService = {
    
    login: (empId, password) => {
        console.log(empId,password)
        return axios.post(API_URL + 'login/', {
            userid: empId,
            password: password,
        });
    }
};

export default authService;
