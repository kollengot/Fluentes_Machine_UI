import axios from 'axios';

const API_URL = "https://funetus-api.herokuapp.com/";

class WorkerService {

    updateWorkerProfile(data) {
        var config = {
            method: 'put',
            url: API_URL + 'worker',
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
    getWorkerProfile() {
        var config = {
            method: 'get',
            url: API_URL + 'worker/profile'
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    getAllProjects() {
        var config = {
            method: 'get',
            url: API_URL + 'project'
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export default new WorkerService();