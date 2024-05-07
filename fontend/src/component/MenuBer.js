import { Nav, Navbar, NavDropdown, Container, Dropdown } from 'react-bootstrap';
import React, { useState, useEffect } from "react";
import axios from '../api/axios';
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import LOGO from '../image/logo1.webp'
import '../styles/Styles.css'

const MenuBer = () => {
  const [login, setLogin] = useState(null)
  const [expanded, setExpanded] = useState(false);
  const nevigate = useNavigate()

  const handleNavbarToggle = () => {
    setExpanded(!expanded);
  };

  const handleNavbarClose = () => {
    setExpanded(false);
  };

  // กดล๊อกเอ้าท์ให้ออกจากหน้านี้และลบ session
  axios.defaults.withCredentials = true
  const auth = async (event) => {
    axios.get('/logout')
      .then(res => {
        if (res.data) {
          setLogin(false)
          nevigate('/')
          window.location.reload()
        }
        else alert('logout unsuccess!')
      })
      .catch(err => console.log(err))
  };

  // ถ้าล๊อกอินให้แสดงปุ่มล๊อกเอ้าท์
  useEffect(() => {
    axios.get('/read-session')
      .then(res => {
        setLogin(res.data.state)
      }
      )
      .catch(err => console.log(err))
  }, [login])

  return (
    <div>
      <Navbar expanded={expanded} collapseOnSelect expand="lg" className="bg-body-tertiary">
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
          <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={handleNavbarToggle} />
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-center">
            {login == 'admin' ?
              <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/" onClick={handleNavbarClose}> Home</Nav.Link>
                <NavDropdown title="Courses" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="/add-course">Add/Remove Courses</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Employees" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="/add-emp-admin">Training History</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Reports" id="collasible-nav-dropdown">
                  <Dropdown.Item href="/courses">FO-ADX-002</Dropdown.Item>
                  <Dropdown.Item href="/employee">FO-ADX-003</Dropdown.Item>
                </NavDropdown>
                <NavDropdown title=" ADMIN ASI シ" id="collasible-nav-dropdown">
                  <NavDropdown.Item onClick={auth}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav> :
              login == 'editor' ?
                <Nav className="me-auto">
                  <Nav.Link as={NavLink} to="/" onClick={handleNavbarClose}> Home</Nav.Link>
                  <NavDropdown title="Courses" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="/add-course">Add/Remove Courses</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="Reports" id="collasible-nav-dropdown">
                    <Dropdown.Item href="/courses">FO-ADX-002</Dropdown.Item>
                    <Dropdown.Item href="/employee">FO-ADX-003</Dropdown.Item>
                  </NavDropdown>
                  <NavDropdown title=" EDITOR ASI シ" id="collasible-nav-dropdown">
                    <NavDropdown.Item onClick={auth}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </Nav> :
                <Nav className="me-auto">
                  <Nav.Link as={NavLink} to="/" onClick={handleNavbarClose}> Home</Nav.Link>
                  <Nav.Link as={NavLink} to="/add-emp-admin" onClick={handleNavbarClose}>Training History</Nav.Link >
                  <Nav.Link as={NavLink} to="/login" >Login</Nav.Link>
                </Nav>

            }
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}

export default MenuBer;