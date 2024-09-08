import React from 'react';
import '../../assets/scss/layout/footer_user.scss'; // Import file CSS cho Footer
import { Button } from 'reactstrap';
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
        <Link to={'/booking'}>
          <Button className="footer-btn "><i className="bi bi-calendar-check me-1"></i>Đặt lịch</Button>
          </Link>
        </div>
        <div>
        <Link to={'/history'}>
          <Button className="footer-btn"><i className="bi bi-clock-fill me-1"></i>Lịch sử</Button>
          </Link>
        </div>
        <div>
        <Link to={'/account'}>
          <Button className="footer-btn"><i className="bi bi-person-fill me-1"></i>Tài khoản</Button>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
