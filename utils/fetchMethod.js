class FetchWrapper {
    constructor(baseUrl) {
        this.baseUrl = baseUrl ? baseUrl : 'http://localhost:3000';
        //console.log(this.baseUrl);
    }

    async post(endpoint, data) {
        try {
            //console.log('POST METHOD')
            const url = this.baseUrl + endpoint
            //console.log(url)
            const response = await fetch(this.baseUrl + endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });
    
            return response;
        } catch (error) {
            console.error('error en fetchmethod post', error);
            throw new Error(`Error en el fetch post ${error}`);
        }
    }

    async get(endpoint) {
        try {
            //console.log('GET METHOD')
            //console.log(this.baseUrl + endpoint)
            const response = await fetch(this.baseUrl + endpoint, {
                method: 'GET',
                // headers: {
                //     'Content-Type': 'application/json',
                // },
                credentials: 'include'
            });
            // const data = await response.json();
            // //console.log(data)
            return response;
        } catch (error) {
            console.error('error en fetchmethod', error);
            throw new Error(`Error en el fetch ${error}`);
        }
    }

    async put(endpoint, data) {
        try {
            const response = await fetch(this.baseUrl + endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });
    
            return response;
        } catch (error) {
            console.error('error en fetchmethod', error);
            throw new Error(`Error en el fetch ${error}`);
        }
    }

    async delete(endpoint) {
        try{
            //console.log('DELETE METHOD')
            //console.log(this.baseUrl + endpoint)
            const response = await fetch(this.baseUrl + endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            //console.log('aa')
            return response;
        }catch(error){
            console.error('error en fetchmethod',error);
            throw new Error(`Error en el fetch ${error}`);
        }
    }

    async patch(endpoint, data){
        try{
            //console.log(data)
            const response = await fetch(this.baseUrl + endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            return response;
        }catch(error){
            console.error('error en fetchmethod',error);
            throw new Error(`Error en el fetch ${error}`);
        }
    }
}



module.exports = {
    fetchsito1: new FetchWrapper('https://api-filmatic.onrender.com')
};
