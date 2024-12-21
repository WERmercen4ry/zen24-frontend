import React, { useEffect, useState } from "react";
import "../../assets/scss/layout/footer_user.scss"; // Import file CSS cho Footer
import { Button } from "reactstrap";
import { Link,useLocation } from "react-router-dom";

const Footer = () => {
  const [userRole, setUserRole] = useState("");
  const location = useLocation();

  const [activeLink, setActiveLink] = React.useState(`${location.pathname}`);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) {
      setUserRole(role);
    }
  }, []);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          {userRole === "Student" ? (
            <div>
              <Link to="/booking"
                className={`text-secondary item-header ${
                  activeLink === "/booking" ? "active-link" : ""
                }`}
                style={{ borderRadius: "10px" }}
                onClick={() => handleLinkClick("/booking")}>
                  <i className="bi bi-calendar-check me-1"></i>Đặt lịch
              </Link>
            </div>
          ) : userRole === "Trainer" ? (
            <Link to="/calendar" className={`text-secondary item-header ${
                  activeLink === "/calendar" ? "active-link" : ""
                }`}
                style={{ borderRadius: "10px" }}
                onClick={() => handleLinkClick("/calendar")}>
                  <i className="bi bi-calendar-check me-1"></i>Lịch dạy
            </Link>
          ) : null}
        </div>
        <div>
          {userRole === "Student" ? (
            <Link to="/history" className={`text-secondary item-header ${
                  activeLink === "/history" ? "active-link" : ""
                }`}
                style={{ borderRadius: "10px" }}
                onClick={() => handleLinkClick("/history")}>
                  <i className="bi bi-clock me-1"></i>Lịch sử
            </Link>
          ) : (
            <Button className="footer-btn">
              {" "}
              {/* <i className="bi bi-clock-fill me-1"></i>Lịch sử */}
            </Button>
          )}
        </div>
        <div>
          <Link to="/account" className={`text-secondary item-header ${
                  activeLink === "/account" ? "active-link" : ""
                }`}
                style={{ borderRadius: "10px" }}
                onClick={() => handleLinkClick("/account")}>
                  <i className="bi bi-person me-1"></i>Tài khoản
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
