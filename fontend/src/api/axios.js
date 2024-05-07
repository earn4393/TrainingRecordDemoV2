import axios from 'axios'

export default axios.create({
    baseURL: 'http://localhost:3331/service2'
    // baseURL: 'http://10.201.128.66:3331/service2'
    // baseURL: 'http://10.201.133.57:3331/service2'
})