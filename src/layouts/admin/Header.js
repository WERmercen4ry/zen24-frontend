import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import authorizedAxiosinstance from "../../utils/authorizedAxios";
import { useNavigate } from "react-router-dom";
import { API_ROOT } from "../../utils/constant";

const Header = () => {
  // eslint-disable-next-line no-unused-vars
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [activeLink, setActiveLink] = React.useState(`${location.pathname}`);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  // State để lưu avatar URL
  const [avatar, setAvatar] = React.useState("");

  // Lấy avatar từ localStorage sau khi component đã được render
  useEffect(() => {
    const avatarUrl = localStorage.getItem("avatar");
    if (avatarUrl) {
      setAvatar(avatarUrl);
    } else {
      setAvatar("/default-avatar.png"); // Avatar mặc định nếu không có trong localStorage
    }
  }, []);
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const logout = async (e) => {
    e.preventDefault();

    await authorizedAxiosinstance.delete(`${API_ROOT}users/logout`);
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
          <Button className="d-lg-none m-auto" onClick={() => showMobilemenu()}>
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
                src={avatar}
                alt="profile"
                className="rounded-circle m-auto"
                width="40"
                height="40"
              ></img>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Thông tin</DropdownItem>
              <Link to={"/admin/profile"}>
                <DropdownItem className="mt-0">Hồ sơ</DropdownItem>
              </Link>
              <DropdownItem divider />
              <DropdownItem className="mt-1" onClick={logout}>
                Đăng xuất
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
