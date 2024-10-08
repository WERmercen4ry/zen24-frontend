import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import user1 from "../assets/images/users/user1.jpg";

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const location = useLocation();

  const [activeLink, setActiveLink] = React.useState(`${location.pathname}`);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  // eslint-disable-next-line no-unused-vars
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };

  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };
  return (
    <div>
      <Navbar color="sec" dark expand="md">
        <div className="d-flex align-items-center">
          <NavbarBrand href="/" className="d-lg-none">
            <DropdownToggle>
              <img
                src={user1}
                alt="profile"
                className="rounded-circle m-auto"
                width="30"
              ></img>
            </DropdownToggle>
          </NavbarBrand>
          <Button
            color="primary"
            className="d-lg-none"
            onClick={() => showMobilemenu()}
          >
            <i className="bi bi-list"></i>
          </Button>
        </div>

        <Collapse navbar isOpen={isOpen}>
          <Nav className="me-auto" navbar>
            <NavItem>
              <Link
                to="/starter"
                className={`text-secondary item-header ${
                  activeLink === "/starter" ? "active-link" : ""
                }`}
                style={{ borderRadius: "10px" }}
                onClick={() => handleLinkClick("/starter")}
              >
                Dashboard
              </Link>
            </NavItem>
            <NavItem>
              <Link
                to="/customers-manager"
                className={`text-secondary item-header ${
                  activeLink === "/customers-manager" ? "active-link" : ""
                }`}
                style={{ borderRadius: "10px" }}
                onClick={() => handleLinkClick("/customers-manager")}
              >
                Quản lý khách hàng
              </Link>
            </NavItem>
            <NavItem>
              <Link
                to="/timetables"
                className={`text-secondary item-header ${
                  activeLink === "/timetables" ? "active-link" : ""
                }`}
                style={{ borderRadius: "10px" }}
                onClick={() => handleLinkClick("/timetables")}
              >
                Thời khoá biểu
              </Link>
            </NavItem>
            <NavItem>
              <Link
                to="/transactions"
                className={`text-secondary item-header ${
                  activeLink === "/transactions" ? "active-link" : ""
                }`}
                style={{ borderRadius: "10px" }}
                onClick={() => handleLinkClick("/transactions")}
              >
                Giao dịch
              </Link>
            </NavItem>
          </Nav>
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle className="avatar">
              <img
                src={user1}
                alt="profile"
                className="rounded-circle m-auto"
                width="30"
              ></img>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Info</DropdownItem>
              <DropdownItem>My Account</DropdownItem>
              <Link to={"/profile"}>
                <DropdownItem>Edit Profile</DropdownItem>
              </Link>
              <DropdownItem divider />
              <DropdownItem>My Balance</DropdownItem>
              <DropdownItem>Inbox</DropdownItem>
              <DropdownItem>Logout</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
