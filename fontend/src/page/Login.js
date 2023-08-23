import React, { useState } from "react";
import { useNavigate, useLocation, NavLink } from 'react-router-dom'
import '../styles/Styles.css'
import '../styles/Login.css'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthProvider'



const Login = () => {
    const auth = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const redirectPath = location.state?.path || '/'


    const handleSubmit = (e) => {
        e.preventDefault()
        const login = auth.login({ user, pwd })
        if (login) {
            navigate(redirectPath, { replace: true })
        } else {
            Swal.fire({
                icon: 'error',
                title: "User or Password wrong",
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    return (
        <div className="WrapperLogin">
            <div className="form-structor">
                <form onSubmit={handleSubmit} className="signup" >
                    <h2 className="form-title" id="signup">Log in</h2>
                    <div className="form-holder">
                        <input
                            type="text"
                            className="input"
                            placeholder="Name"
                            autoComplete='off'
                            onChange={e => setUser(e.target.value)}
                            style={{ height: '50px', fontSize: '16px' }}
                        />
                        <input
                            type="password"
                            className="input"
                            placeholder="Password"
                            onChange={e => setPwd(e.target.value)}
                            style={{ height: '50px', fontSize: '16px' }}
                        />
                    </div>
                    <button className="submit-btn">Log in</button>
                </form>
                <div className="login slide-up" >
                    <div className="center">
                        <NavLink to='/'><h2 className="form-title" id="login">Home</h2></NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login