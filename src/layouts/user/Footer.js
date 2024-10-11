import React, { useEffect, useState } from "react";
import "../../assets/scss/layout/footer_user.scss"; // Import file CSS cho Footer
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) {
      setUserRole(role);
    }
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          {userRole === "Student" ? (
            <Link to={"/booking"}>
              <Button className="footer-btn">
                <i className="bi bi-calendar-check me-1"></i>Đặt lịch
              </Button>
            </Link>
          ) : userRole === "Trainer" ? (
            <Link to={"/calendar"}>
              <Button className="footer-btn">
                <i className="bi bi-calendar-check me-1"></i>Lịch dạy
              </Button>
            </Link>
          ) : null}
        </div>
        <div>
          {userRole === "Student" ? (
            <Link to={"/history"}>
              <Button className="footer-btn">
                <i className="bi bi-clock-fill me-1"></i>Lịch sử
              </Button>
            </Link>
          ) : (
              " "
          )}
        </div>
        <div>
          <Link to={"/account"}>
            <Button className="footer-btn">
              <i className="bi bi-person-fill me-1"></i>Tài khoản
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
