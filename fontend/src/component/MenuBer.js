import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthProvider'
import { Outlet, NavLink } from 'react-router-dom'
import LOGO from '../image/logo1.webp'
import '../styles/Styles.css'

const MenuBer = () => {
  const auth = useAuth()
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={NavLink} to="/" >
            <img
              src={LOGO}
              width="50"
              height="50"
              className="d-inline-block "
              alt="React Bootstrap logo"
            />{' '}
            Training Record
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-center">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/"> Home</Nav.Link>
              <Nav.Link as={NavLink} to="/employee"> Profile Employees</Nav.Link>
              <Nav.Link as={NavLink} to="/add-course">Register Courses</Nav.Link>
              <Nav.Link as={NavLink} to="/add-emp-admin">Register Employees </Nav.Link >
              {auth.auth ?
                <NavDropdown title=" ADMIN ASI シ" id="collasible-nav-dropdown">
                  <NavDropdown.Item onClick={() => auth.logout()}>Logout</NavDropdown.Item>
                </NavDropdown> :
                <Nav.Link as={NavLink} to="/login" >Login</Nav.Link>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}

export default MenuBer;