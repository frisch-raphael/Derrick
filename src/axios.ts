// A wrapper around axios with TS and async/await 
// code below would be it's own .tsx file:

/* eslint-disable no-console */
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { IEngagement } from './dtos/engagement';

const apiRoot = 'http://localhost:3000/';

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
        const response = await client.request<T>(options)
        return response;
    } catch (error) {
        const err = error as AxiosError;

        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
        } else if (err.request) {
            // The request was made but no response was received
            // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(err.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', err.message);
        }
        console.log(err.config);
        throw error;
    }
};

export default request;
