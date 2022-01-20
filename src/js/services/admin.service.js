import axios from 'axios';

const API_URL = "https://funetus-api.herokuapp.com/admin/";

// Add a request interceptor
axios.interceptors.request.use(
    config => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            config.headers['Authorization'] = 'Bearer ' + user.token;
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        Promise.reject(error)
    });

axios.interceptors.response.use((response) => {
    return response
},
    function (error) {
       // window.location.href = `/`;
        return Promise.reject(error);
    });


class AdminService {

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
                console.log(error);
            });
    }
    changeStatus(quoteId,data) {
        var config = {
            method: 'post',
            url: API_URL + '/quotes/'+quoteId+'/changeStatus',
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

    tagQuote(data) {
        //https://funetus-api.herokuapp.com/admin/quotes/tagQuotes
        var config = {
            method: 'PUT',
            url: API_URL + 'quotes/tagQuotes',
            data: data
        };

        return axios(config)
            .then(function (response) {
                console.log(response);
                return response;
            })
            .catch(function (error) {
                console.log(error);
                console.log(error);
            });
    }
    assignQuoteInspection(quoteId,data) {
        var config = {
            method: 'post',
            url: API_URL + 'quotes/assignQuoteInspection/'+quoteId,
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
    applyTax(quoteId,data) {
        var config = {
            method: 'post',
            url: API_URL + 'quotes/addTaxValue/'+quoteId,
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

    getAllWorkers(pageNo) {
        var config = {
            method: 'get',
            url: API_URL + 'workers?page='+pageNo
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    createWorker(data) {
        var config = {
            method: 'post',
            url: API_URL + 'workers',
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

    deleteWorker(id) {
        var config = {
            method: 'DELETE',
            url: API_URL + 'workers/' + id
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    editWorker(id,data) {
        var config = {
            method: 'put',
            url: API_URL + 'workers/'+id,
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

    getAllOperations() {
        var config = {
            method: 'get',
            url: API_URL + 'operation'
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    getOperationById(id) {
        var config = {
            method: 'get',
            url: API_URL + 'operation/' + id
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    deleteOperation(id) {
        var config = {
            method: 'DELETE',
            url: API_URL + 'operation/' + id
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    createOperation(data) {
        var config = {
            method: 'post',
            url: API_URL + 'operation',
            data: data
        };
        console.log(config);
        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    editOperation(id,data) {
        var config = {
            method: 'put',
            url: API_URL + 'operation/'+id,
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
    getAllInventory(pageNo) {
        var config = {
            method: 'get',
            url: API_URL + 'inventory?page='+pageNo
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    createInventory(data) {
        var config = {
            method: 'post',
            url: API_URL + 'inventory',
            data: data
        };
        console.log(config);
        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    editInventory(id,data) {
        var config = {
            method: 'put',
            url: API_URL + 'inventory/'+id,
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
    deleteInventory(id) {
        var config = {
            method: 'DELETE',
            url: API_URL + 'inventory/' + id
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
    deleteProject(id) {
        var config = {
            method: 'DELETE',
            url: API_URL + 'project/' + id
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    getSingleProject(id) {
        var config = {
            method: 'get',
            url: API_URL + 'project/' + id
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    editProject(id,data) {
        var config = {
            method: 'put',
            url: API_URL + 'project/'+id,
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

    

    getAllCustomers(pageNo) {
        var config = {
            method: 'get',
            url: API_URL + 'customer?page='+pageNo
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    deleteCustomer(id) {
        var config = {
            method: 'DELETE',
            url: API_URL + 'customer/' + id
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    editCustomer(id,data) {
        var config = {
            method: 'put',
            url: API_URL + 'customer/'+id,
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
    

    getAllInspection() {
        var config = {
            method: 'get',
            url: API_URL + 'inspection'
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    createInspection(data) {
        var config = {
            method: 'post',
            url: API_URL + 'inspection',
            data: data
        };
        console.log(config);
        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    editInspection(id,data) {
        var config = {
            method: 'put',
            url: API_URL + 'inspection/'+id,
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
    deleteInspection(id) {
        var config = {
            method: 'DELETE',
            url: API_URL + 'Inspection/' + id
        };

        return axios(config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    changeProjectStatus(id, data) {
        var config = {
            method: 'post',
            url: API_URL + 'project/changeStatus/'+ id,
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
    convertToProject(id, data) {
        var config = {
            method: 'put',
            url: API_URL + 'quotes/convertToProject/'+ id,
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

}

export default new AdminService();