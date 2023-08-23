import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

const RequireAuth = ({ children }) => {
    const location = useLocation()
    const auth = useAuth()
    if (!auth.auth) {
        if (location.pathname == '/add-emp-admin') {
            return <Navigate to='/add-employee' />
        } else {
            return <Navigate to='/login' state={{ path: location.pathname }} />
        }

    }
    return children
}

export default RequireAuth