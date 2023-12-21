import { useNavigate, useLocation } from 'react-router-dom'
import React, { useEffect } from 'react';
import axios from '../api/axios';

const RequireAuth = ({ children }) => {
    const location = useLocation()
    const nevigate = useNavigate()

    axios.defaults.withCredentials = true
    useEffect(() => {
        axios.get('/read-session')
            .then(res => {
                if (res.data.state === 'user') {
                    if (location.pathname === '/add-emp-admin') nevigate('/add-employee')
                    else nevigate('/login', { state: { path: location.pathname } })
                }
            }
            )
            .catch(err => console.log(err))
    }, [])
    return children
}

export default RequireAuth