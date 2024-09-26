import React, { useState, useEffect } from "react";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import "../../assets/scss/layout/header_user.scss"; // Import file CSS cho Header
import Logo from "./Logo";
import TextWithTooltip from "./TextWithTooltip";
import { useNavigate } from "react-router-dom";
import authorizedAxiosinstance from "../../utils/authorizedAxios";
import { API_ROOT } from "../../utils/constant";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [notifications, setNotifications] = useState([]);

  // Lấy avatar và thông tin người dùng từ localStorage sau khi component đã được render
  useEffect(() => {
    const avatarUrl = localStorage.getItem("avatar");
    const userInfoGet = localStorage.getItem("profile");
    if (avatarUrl) {
      setAvatar(avatarUrl);
    } else {
      setAvatar("/default-avatar.png");
    }
    if (userInfoGet) {
      setUserInfo(JSON.parse(userInfoGet));
    }
    fetchNotification();
  }, []);

  // Gọi API lấy danh sách thông báo
  const fetchNotification = () => {
    const userId = localStorage.getItem("userId");
    authorizedAxiosinstance
      .get(`${API_ROOT}users/notifications?userId=${userId}`)
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  };

  // Cập nhật thông báo tự động mỗi 5 phút
  useEffect(() => {
    const intervalId = setInterval(fetchNotification, 300000); // 5 phút = 300000 ms
    return () => clearInterval(intervalId); // Cleanup interval khi component unmount
  }, []);

  // Xử lý khi người dùng click vào thông báo
  const handleNotificationClick = (id) => {
    toggleDropdown();
    navigate(`/notification-detail`, { state: { notiId: id } });
    fetchNotification();
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Logo />
        </div>
        <div className="header-search d-xs-none">
          <p className="infor-name my-auto">
            Xin chào {userInfo?.profile?.name || ""}
          </p>
          <p className="infor-user my-auto d-flex">
            <i className="bi bi-geo-alt-fill me-1"></i>
            <TextWithTooltip
              text={userInfo?.profile?.address || ""}
              maxChars={70}
            />
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
              <span className="msg-count">
                {" "}
                {notifications.filter((notification) => !notification.is_read)
                  .length || 0}
              </span>
            </DropdownToggle>
            {dropdownOpen && <div className="notification-arrow"></div>}
            <DropdownMenu
              right
              className="notification-menu"
              style={{ maxHeight: "350px", overflowY: "auto" }}
            >
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    onClick={() => handleNotificationClick(notification._id)}
                    className="notification-item"
                    key={notification._id}
                  >
                    {/* Hiển thị dấu chấm đỏ nếu thông báo chưa được đọc */}
                    <div className="inbox-btn ms-0 me-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-bell-fill notification-icon"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                      </svg>
                      {!notification.is_read && (
                        <span className="msg-count-detail"></span>
                      )}
                    </div>
                    <div className="notification-content">
                      <strong>{notification.title || "Thông báo"}</strong>
                      <p>{notification.message}</p>
                      <span className="notification-time">
                        {new Date(notification.created_at).toLocaleString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          }
                        )}
                      </span>
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
            src={avatar}
            alt="profile"
            className="rounded-circle m-auto avatar"
            width="45"
            height="45"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
