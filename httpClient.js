import axios from 'axios';

const instance = axios.create({
    // Your Axios configuration
});

function axiosRequestToCurl(config) {
    let command = ['curl'];

    // Set method
    command.push(`-X ${config.method.toUpperCase()}`);
    // Add headers
    if (config.headers) {
        for (const [header, value] of Object.entries(config.headers)) {
            command.push(`-H '${header}: ${JSON.stringify(value)}'`);
        }
    }

    // Add data
    if (config.data) {
        command.push(`--data '${JSON.stringify(config.data, null, 2)}'`);
    }

    // Set URL
    command.push(`'${config.url}'`);

    return command.join(' ');
}

if (__DEV__) {
    instance.interceptors.request.use(request => {
        console.log('Request:', request);
        const curlRequest = axiosRequestToCurl(request);
        // console.log(curlRequest);
        return request;
    });

    instance.interceptors.response.use(
        response => {
            // console.log('Response:', response);
            return response;
        },
        error => {
            console.log('Error:', error);
            return Promise.reject(error);
        },
    );
}

export default instance;
