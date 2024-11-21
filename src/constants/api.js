import axios from 'axios';

const { hostname } = window.location;

let baseURL;

if (hostname === 'hrdemo.unitdtechnologies.com') {
  baseURL = 'http://192.64.114.83:2029';
} else {
  baseURL = 'http://localhost:2029';
}

console.log('Selected Base URL:', baseURL);

const api = axios.create({
  baseURL,
});

export default api;