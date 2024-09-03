import React from "react";
import { Link } from "react-router-dom";
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
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import user1 from "../assets/images/users/user1.jpg";

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
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
                className="rounded-circle"
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
                className="nav-link text-secondary item-header"
                style={{ borderRadius: "10px" }}
              >
                Dashboard
              </Link>
            </NavItem>
            <NavItem>
              <Link
                to="/about"
                className="nav-link text-secondary item-header"
                style={{ borderRadius: "10px" }}
              >
                Quảng lý khách hàng
              </Link>
            </NavItem>
            <NavItem>
              <Link
                to="/about"
                className="nav-link text-secondary item-header"
                style={{ borderRadius: "10px" }}
              >
                Thời khoá biểu
              </Link>
            </NavItem>
            <NavItem>
              <Link
                to="/about"
                className="nav-link text-secondary item-header"
                style={{ borderRadius: "10px" }}
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
                className="rounded-circle "
                width="30"
              ></img>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Info</DropdownItem>
              <DropdownItem>My Account</DropdownItem>
              <Link to={'/profile'}>
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
      <Navbar color="sec" dark expand="md" className="breadcrumbs">
        <Breadcrumb className="">
          <BreadcrumbItem>
            <a href="/">Home</a>
          </BreadcrumbItem>
          <BreadcrumbItem active>Library</BreadcrumbItem>
        </Breadcrumb>
      </Navbar>
    </div>
  );
};

export default Header;
