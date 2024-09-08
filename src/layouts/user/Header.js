import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import '../../assets/scss/layout/header_user.scss'; // Import file CSS cho Header
import Logo from "./Logo";
import user1 from "../../assets/images/users/user1.jpg";
import TextWithTooltip from './TextWithTooltip';// Thêm icon thông báo
import { useNavigate } from 'react-router-dom'; // Import hook điều hướng

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  const userInfo = {
    name: 'Nguyễn Văn A',
    address: '1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô',
  };

  // Danh sách thông báo mẫu
  const notifications = [
    {
      id: 1,
      title: 'Lớp học sắp bắt đầu',
      message: 'Lớp học của Quý khách viên sẽ diễn ra sau 24 giờ nữa.',
      time: '17:55 - 05/09/2024',
    },
    {
      id: 2,
      title: 'Lớp học sắp bắt đầu',
      message: 'Lớp học của Quý khách viên sẽ diễn ra sau 12 giờ nữa.',
      time: '09:00 - 04/09/2024',
    },
  ];
  const handleNotificationClick = (id) => {
    toggleDropdown();
    navigate(`/notification-detail/${id}`); // Điều hướng đến trang chi tiết với id của thông báo
  };
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Logo />
        </div>
        <div className="header-search d-xs-none">
          <p className="infor-name my-auto">Xin chào {userInfo.name}</p>
          <p className="infor-user my-auto d-flex">
            <i className="bi bi-geo-alt-fill me-1"></i>
            <TextWithTooltip text={userInfo.address} maxChars={70} />
          </p>
        </div>
        <div className="header-right">
          {/* Dropdown cho chuông thông báo */}
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle className="inbox-btn" tag="button">
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
            </DropdownToggle>
            {dropdownOpen && <div className="notification-arrow"></div>} {/* Mũi tên */}
            <DropdownMenu right className="notification-menu">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div onClick={() => handleNotificationClick(notification.id)} className="notification-item" key={notification.id} >
                    <img
                      src={user1}
                      alt="notification icon"
                      className="notification-icon"
                    />
                    <div className="notification-content">
                      <strong>{notification.title}</strong>
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="notification-item">Không có thông báo mới</div>
              )}
            </DropdownMenu>
          </Dropdown>
          {/* Avatar người dùng */}
          <img
            src={user1}
            alt="profile"
            className="rounded-circle m-auto avatar"
            width="45"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
