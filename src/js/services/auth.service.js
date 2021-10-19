import axios from "axios";

const API_URL = "https://funetus-api.herokuapp.com/auth/";

class AuthService {

    login(data) {
        var config = {
            method: 'post',
            url: API_URL + 'login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        return axios(config)
            .then(function (response) {
                if(response.data) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    loginWorker(data) {
        var config = {
            method: 'post',
            url: API_URL + 'workerLogin',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        return axios(config)
            .then(function (response) {
                if(response.data) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    logout() {
        localStorage.removeItem("user");
    }

    register(username, email, password) {
        return axios.post(API_URL + "signup", {
            username,
            email,
            password
        });
    }
    forgotPassword(data) {
        var config = {
            method: 'post',
            url: API_URL + "forgotPassword",
            data: data
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    verifyReset(data) {
        var config = {
            method: 'post',
            url: API_URL + "verifyReset",
            data: data
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    createCustomer(data) {
        var config = {
            method: 'put',
            url: API_URL + "signup",
            data: data
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();