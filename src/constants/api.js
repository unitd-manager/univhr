
// import axios from 'axios'

// const api = axios.create({
// baseURL: 'https://univhr.unitdtechnologies.com:3005',
// // baseURL: 'http://localhost:5009'
// });

// export default api

import axios from 'axios';

const { hostname } = window.location;

let baseURL;

if (hostname === 'univhr.unitdtechnologies.com') {
  baseURL = 'http://192.64.114.83:3005';
} else {
  baseURL = 'http://localhost:3005';
}

console.log('Selected Base URL:', baseURL);

const api = axios.create({
  baseURL,
});

export default api;