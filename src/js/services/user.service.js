import axios from 'axios';

const API_URL = "https://funetus-api.herokuapp.com/";

class UserService {

    getAllQuotes(pageNo) {
        var config = {
            method: 'get',
            url: API_URL + 'quotes?page='+pageNo
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getSingleQuote(quoteId) {
        var config = {
            method: 'get',
            url: API_URL + 'quotes/' + quoteId
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    createQuote(data) {
        var config = {
            method: 'post',
            url: API_URL + 'quotes',
            data: data
        };
        return axios(config)
            .then(function (response) {
                console.log(response);
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    editQuote(quoteId, data) {
        var config = {
            method: 'put',
            url: API_URL + 'quotes/' + quoteId,
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

    deleteQuote(quoteId) {
        var config = {
            method: 'DELETE',
            url: API_URL + 'quotes/' + quoteId
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                return({message: error.message});
            });
    }

    changeStatus(id, data) {
        var config = {
            method: 'post',
            url: API_URL + 'quotes/'+ id +'/changeStatus',
            data: data
        };
        return axios(config)
            .then(function (response) {
                console.log(response);
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    savePOUrl(id, data) {
        var config = {
            method: 'post',
            url: API_URL + 'quotes/submitPOUrl/'+ id ,
            data: data
        };
        return axios(config)
            .then(function (response) {
                console.log(response);
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getSingleCustomer() {
        var config = {
            method: 'get',
            url: API_URL + 'user'
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    updateUserProfile(data) {
        var config = {
            method: 'put',
            url: API_URL + 'user',
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

}

export default new UserService();