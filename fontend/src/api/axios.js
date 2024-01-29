import axios from 'axios'

export default axios.create({
    baseURL: 'http://localhost:3331/service2'
})