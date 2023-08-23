import React from 'react'
import { useAuth } from '../context/AuthProvider'
import { Nav, Navbar, Dropdown, Container } from 'react-bootstrap';
import { Outlet, NavLink } from 'react-router-dom'
import LOGO from '../image/logo1.png'
import '../styles/Styles.css'



const MenuBer = () => {
  const auth = useAuth()
  return (
    <div>
      <Navbar expand="lg">
        <Container >
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
          <Navbar.Toggle aria-controls="basic-navbar-nav" label='123' />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/"> Home</Nav.Link>
              <Nav.Link as={NavLink} to="/employee"> Profile Employees</Nav.Link>
              <Nav.Link as={NavLink} to="/add-course">Register Courses</Nav.Link>
              <Nav.Link as={NavLink} to="/add-emp-admin">Register Employees </Nav.Link >
              {auth.auth ?
                <Dropdown>
                  <Dropdown.Toggle variant="Secondary" id="dropdown-basic">
                    ADMIN ASI シ
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => auth.logout()}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown> :
                <Nav.Link as={NavLink} to="/login" >Login</Nav.Link>
              }
            </Nav>
            {/* <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/"> Home</Nav.Link>
              <Nav.Link as={NavLink} to="/employee"> Profile Employees</Nav.Link>
            </Nav> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>


  );
}

export default MenuBer;