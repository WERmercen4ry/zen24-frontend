import React from "react";
import { ListGroup, ListGroupItem, Container, Row, Col } from "reactstrap";
import {
  BsPerson,
  BsArchive,
  BsShield,
  BsPhone,
  BsKey,
  BsBoxArrowRight,
} from "react-icons/bs"; // Bootstrap icons
import "../../../assets/scss/layout/user_page.scss";
import { useNavigate } from "react-router-dom";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";

const AccountOptions = () => {
  const navigate = useNavigate();
  const options = [
    {
      title: "Thông tin cá nhân",
      icon: <BsPerson />,
      path: "/account/update-user",
    },
  ];
  const options2 = [
    { title: "Bảo lưu", icon: <BsArchive />, path: "/account/reverse" },
    {
      title: "Các chính sách khác",
      icon: <BsShield />,
      path: "/account/policy",
    },
    { title: "Hỗ trợ", icon: <BsPhone />, path: "/account/support" },
    {
      title: "Đổi mật khẩu",
      icon: <BsKey />,
      path: "/account/change-password",
    },
  ];
  const options3 = [
    { title: "Đăng xuất", icon: <BsBoxArrowRight />, path: "/logout" },
  ];
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
    <Container className="workout-history mt-2 card-content">
      <Row>
        <Col className="text-center">
          <h2 className="history-title">TÀI KHOẢN</h2>
        </Col>
      </Row>
      <ListGroup flush className="mb-4">
        {options.map((option, index) => (
          <ListGroupItem
            key={index}
            className="opption-items d-flex justify-content-between align-items-center py-3"
            tag="a"
            href={option.path}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center">
              <span className="me-3">{option.icon}</span>
              {option.title}
            </div>
            <i className="bi bi-caret-right-fill"></i>
          </ListGroupItem>
        ))}
      </ListGroup>
      <ListGroup flush className="mb-4">
        {options2.map((option, index) => (
          <ListGroupItem
            key={index}
            className="opption-items mb-1 d-flex justify-content-between align-items-center py-3"
            tag="a"
            href={option.path}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center">
              <span className="me-3">{option.icon}</span>
              {option.title}
            </div>
            <i className="bi bi-caret-right-fill"></i>
          </ListGroupItem>
        ))}
      </ListGroup>
      <ListGroup flush>
        {options3.map((option, index) => (
          <ListGroupItem
            key={index}
            className="opption-items d-flex justify-content-between align-items-center py-3"
            tag="a"
            onClick={logout}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center">
              <span className="me-3">{option.icon}</span>
              {option.title}
            </div>
            <i className="bi bi-caret-right-fill"></i>
          </ListGroupItem>
        ))}
      </ListGroup>
    </Container>
  );
};

export default AccountOptions;
