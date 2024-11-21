
import axios from 'axios'

const api = axios.create({
baseURL: 'https://univhr.unitdtechnologies.com:3005',
// baseURL: 'http://localhost:5009'
});

export default api