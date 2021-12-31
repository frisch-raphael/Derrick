// A wrapper around axios with TS and async/await 
// code below would be it's own .tsx file:

/* eslint-disable no-console */
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const apiRoot = 'http://localhost:30000/';

/**
 * Create an Axios Client with baseURL as default
 */
const client = axios.create({
    baseURL: apiRoot,
});

/**
 * A lightweight wrapper for axios - a Promise based HTTP client for the browser and node.js
 * see https://github.com/axios/axios#request-config for config options
 */
const request = async <T>(options: AxiosRequestConfig) => {
    try {
        const response = await client.request<T>(options);
        return response;
    } catch (error) {
        const err = error as AxiosError;

        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
        } else if (err.request) {
            // The request was made but no response was received
            // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
        } else {
            // Something happened in setting up the request that triggered an Error
        }
        throw error;
    }
};

export default request;
