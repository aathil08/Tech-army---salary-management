import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

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
