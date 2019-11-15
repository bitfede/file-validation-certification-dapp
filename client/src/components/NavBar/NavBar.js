import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

// UI COMPONENTS
import { faSearch, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormInput,
  Collapse
} from "shards-react";

// style
import "./NavBar.css";

import iconimg from "../../assets/iconz.png"

class NavBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      collapseOpen: false
    };
  }

  toggleDropdown() {
  this.setState({
      ...this.state,
      ...{
        dropdownOpen: !this.state.dropdownOpen
      }
    });
  }

  toggleNavbar() {
    this.setState({
      ...this.state,
      ...{
        collapseOpen: !this.state.collapseOpen
      }
    });
  }



  render() {

    return (
      <Navbar type="dark" theme="primary" expand="md">
  <NavbarBrand href="#">BFT</NavbarBrand>
  <NavbarToggler onClick={() => this.toggleNavbar()} />

  <Collapse open={this.state.collapseOpen} navbar>
    <Nav navbar>
      <NavItem>
        <NavLink active href="#">
          Active
        </NavLink>
      </NavItem>

      <Dropdown
        open={this.state.dropdownOpen}
        toggle={() => this.toggleDropdown()}
      >
        <DropdownToggle nav caret>
          Dropdown
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>Action</DropdownItem>
          <DropdownItem>Another action</DropdownItem>
          <DropdownItem>Something else here</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Nav>

    <Nav navbar className="ml-auto">
    <NavItem>
      <NavLink href="#">
        <FontAwesomeIcon icon={faInfoCircle} />
      </NavLink>
    </NavItem>
    </Nav>
  </Collapse>
</Navbar>
    )
  }
}

export default NavBar
