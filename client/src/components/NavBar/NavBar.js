import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import { FlexboxGrid, Button, Navbar, Dropdown, Nav, Icon } from 'rsuite';

// style
import 'rsuite/dist/styles/rsuite-default.css'
import "./NavBar.css";

import iconimg from "../../assets/iconz.png"

class NavBar extends Component {

  state = {
    test: 'Heelloo'
  };



  render() {

    return (
      <Navbar>
        <Navbar.Header>
          <a href="#"><img style={{width: '56px', height: '56px'}} src={iconimg} className="navbar-brand logo" /></a>
        </Navbar.Header>
        <Navbar.Body>
          <Nav>
            <Nav.Item icon={<Icon icon="home" />} >Home</Nav.Item>
            {/* <Nav.Item>Products</Nav.Item> */}
            <Dropdown title="About">
              <Dropdown.Item>Company</Dropdown.Item>
              <Dropdown.Item>Team</Dropdown.Item>
              <Dropdown.Item>Contact</Dropdown.Item>
            </Dropdown>
          </Nav>
          <Nav pullRight>
            <Nav.Item icon={<Icon icon="cog" />} >Settings</Nav.Item>
          </Nav>
        </Navbar.Body>
      </Navbar>
    )
  }
}

export default NavBar
