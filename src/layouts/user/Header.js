import React from "react";
import "../../assets/scss/layout/header_user.scss"; // Import file CSS cho Header
import Logo from "./Logo";
import user1 from "../../assets/images/users/user1.jpg";
const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Logo></Logo>
        </div>
        <div className="header-search">
          <p className="infor-name my-auto">Xin chào Nguyễn Văn A</p>
          <p className="infor-user my-auto">
            <i className="bi bi-geo-alt-fill"></i> 1. FOURT PILATES- Số 9, Đường
            10, KDT Hà Đô
          </p>
        </div>
        <div className="header-right">
          <button className="inbox-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-bell-fill"
              viewBox="0 0 16 16"
            >
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
            </svg>
            <span className="msg-count">99</span>
          </button>
          <img
            src={user1}
            alt="profile"
            className="rounded-circle m-auto"
            width="45"
          ></img>
        </div>
      </div>
    </header>
  );
};
export default Header;
