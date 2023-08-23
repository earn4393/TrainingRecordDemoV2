import React, { createContext, useContext, useEffect, useState } from "react";
import axios from '../api/axios';

const AuthContext = createContext(null);
const AUTH = '/auth'

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState("")
    const [pwd, setPWD] = useState("")
    const [auth, setAuth] = useState(false)

    const authentication = async () => {
        const resAccount = await axios.post(AUTH)
        if (resAccount.data.data !== null) {
            setUser(resAccount.data.data.user)
            setPWD(resAccount.data.data.pwd)
        }
    }

    const login = (input) => {
        if (user !== "" & pwd !== "") {
            if (input.user === user && input.pwd === pwd) {
                setAuth(true)
                return true
            } else {
                setAuth(false)
                return false
            }
        }
    }

    const logout = () => {
        setAuth(false)
    }

    useEffect(() => {
        authentication()
    }, [])

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}