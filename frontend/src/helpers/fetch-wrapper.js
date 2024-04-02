import { useAuthStore } from '@/stores';

export const fetchWrapper = {
    get: (url, optionalHeaders = null) => request('GET', url, optionalHeaders),
    post: (url, body, optionalHeaders = null) => request('POST', url, optionalHeaders, body),
    put: (url, body, optionalHeaders = null) => request('PUT', url, optionalHeaders, body),
    delete: (url, optionalHeaders = null) => request('DELETE', url, optionalHeaders)
};

function request(method, url, optionalHeaders, body = null, tries = 1) {
    const requestOptions = {
        method,
        headers: { ...authHeader(url), ...(optionalHeaders?.headers || {}) }
    };

    if (body) {
        if (!requestOptions.headers['Content-Type']) {
            requestOptions.headers['Content-Type'] = 'application/json';
        }
        requestOptions.body = JSON.stringify(body);
    }

    function handleError(error) {
        const { waitForClerk } = useAuthStore();

        if (error.status == 401) {
            console.log('Token expired, retrying... retries left: ', tries);
            if(!tries){
                console.log('No more retries. You\'re COOKED.');
                throw error;
            }
            let triesLeft = tries - 1;

            return waitForClerk().then( status => request(method, url, optionalHeaders, body, triesLeft))
        }

        if ([401, 403].includes(error.status)) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            // console.log(error.body)
            // const data = JSON.parse(error.body)
            // const errorMessage = (data && data.message) || error.statusText;
            console.log('YOU\'RE OUT, ITS OVER');
            return Promise.reject(error);
        }

        // For all other cases of error
        return Promise.reject(error)

    }

    return fetch(url, requestOptions).then(handleResponse).catch(handleError);

}

// helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const token = sessionStorage.getItem('__session')
    const isApiUrl = url.startsWith(import.meta.env.VITE_BACKEND) || true;
    if (token && isApiUrl) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
}

function handleResponse(response) {
    if (!response.ok) {
        throw response
    }

    if (response.headers.get('Content-Type').startsWith('application/json')) {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            return data;
        })
    } else {
        return response.blob().then( blooob => (URL.createObjectURL(blooob)))
    }

}