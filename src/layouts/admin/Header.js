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
import user1 from "../../assets/images/users/user1.jpg";
import authorizedAxiosinstance from "../../utils/authorizedAxios";
import { useNavigate } from "react-router-dom";
import { API_ROOT } from "../../utils/constant";

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [activeLink, setActiveLink] = React.useState(`${location.pathname}`);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const logout = async (e) => {
    e.preventDefault();

    const res = await authorizedAxiosinstance.delete(
      `${API_ROOT}users/logout`
    );
    localStorage.removeItem("profile");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div>
      <Navbar color="sec" dark expand="md">
        <div className="d-flex align-items-center">
          <NavbarBrand href="/" className="d-lg-none m-auto">
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
            className="d-lg-none m-auto"
            onClick={() => showMobilemenu()}
          >
            <i className="bi bi-list"></i>
          </Button>
        </div>

        <Collapse navbar isOpen={isOpen}>
          <Nav className="me-auto" navbar>
            <NavItem>
              <Link
                to="/admin/dashboard"
                className={`text-secondary item-header ${
                  activeLink === "/admin/dashboard" ? "active-link" : ""
                }`}
                style={{ borderRadius: "10px" }}
                onClick={() => handleLinkClick("/starter")}
              >
                Dashboard
              </Link>
            </NavItem>
            <NavItem>
              <Link
                to="/admin/customers-manager"
                className={`text-secondary item-header ${
                  activeLink === "/admin/customers-manager" ? "active-link" : ""
                }`}
                style={{ borderRadius: "10px" }}
                onClick={() => handleLinkClick("/customers-manager")}
              >
                Quản lý khách hàng
              </Link>
            </NavItem>
            <NavItem>
              <Link
                to="/admin/timetables"
                className={`text-secondary item-header ${
                  activeLink === "/admin/timetables" ? "active-link" : ""
                }`}
                style={{ borderRadius: "10px" }}
                onClick={() => handleLinkClick("/timetables")}
              >
                Thời khoá biểu
              </Link>
            </NavItem>
            <NavItem>
              <Link
                to="/admin/transactions"
                className={`text-secondary item-header ${
                  activeLink === "/admin/transactions" ? "active-link" : ""
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
              <Link to={"/admin/profile"}>
                <DropdownItem className="mt-0">Edit Profile</DropdownItem>
              </Link>
              <DropdownItem divider />
              <DropdownItem onClick={logout}>Logout</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
