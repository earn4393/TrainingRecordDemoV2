import React, { useState } from "react";
import { useNavigate, useLocation, NavLink } from 'react-router-dom'
import axios from "../api/axios";
import '../styles/Styles.css'
import '../styles/Login.css'
import Swal from 'sweetalert2'

// ล๊อกอิน
const Login = () => {
    const navigate = useNavigate() // สำหรับไปหน้าถัดไป
    const location = useLocation() // path ที่อยู่ปัจจุบัน
    const [user, setUser] = useState('') // ชื่อผู้ใช้
    const [pwd, setPwd] = useState('') // รหัสผู้ใช้
    const redirectPath = location.state?.path || '/'  // ตรวจสอบว่าเป็น path อะไร

    // ตรวจสอบว่าชื่อผู้ใช้และรหัสผ่านถูกต้องหรือไม่
    axios.defaults.withCredentials = true
    const handleSubmit = async (e) => {
        e.preventDefault()
        await axios.post('/auth', { user: user, pwd: pwd })
            .then(res => {
                if (res.data.state !== 'user') {
                    navigate(redirectPath, { replace: true })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: "User or Password wrong",
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
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
                    <button type="submit" className="submit-btn">Log in</button>
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