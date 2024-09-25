import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col } from "reactstrap";
import "../../../assets/scss/layout/user_page.scss";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";
import { useLocation } from "react-router-dom";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";
const NotificateDetail = () => {
  const location = useLocation();
  const { notiId } = location.state || {};  // Kiểm tra state truyền vào
  const [notification, setNotification] = useState();
  const { showLoader, hideLoader } = useContext(LoaderContext);
  useEffect(() => {
    if (notiId) {
      fetchNotificationDetail();
    }
  }, [notiId]);

  const fetchNotificationDetail = () => {
    showLoader();
    authorizedAxiosinstance
      .get(`${API_ROOT}users/notification-by-id?NotificationId=${notiId}`)
      .then((res) => {
        setNotification(res.data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
    hideLoader();
  };

  if (!notiId) {
    return (
      <Container className="workout-history mt-2 card-content">
        <Row>
          <Col className="text-center">
            <h2 className="history-title">Thông báo không tồn tại</h2>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!notification) {
    return (
      <Container className="workout-history mt-2 card-content">
        <Row>
          <Col className="text-center">
            <h2 className="history-title">Đang tải thông báo...</h2>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="workout-history mt-2 card-content">
      <Row>
        <Col className="text-center">
          <h2 className="history-title">Chi tiết thông báo</h2>
        </Col>
      </Row>
      <div className="package-info pb-4">
        <div className="notification-detail">
          <h2>{notification.title || "Thông báo"}</h2>
          <p>{notification.message}</p>
          <span>
            {new Date(notification.created_at).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}
          </span>
        </div>
      </div>
    </Container>
  );
};

export default NotificateDetail;
