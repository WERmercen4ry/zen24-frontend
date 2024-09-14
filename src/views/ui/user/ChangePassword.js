import React from "react";
import { Container, Row, Col, Input, Button } from "reactstrap";
import "../../../assets/scss/layout/user_page.scss";

const ChangePassword = () => {
  return (
    <Container className="workout-history mt-2 card-content">
      <Row>
        <Col className="text-center">
          <h2 className="history-title">Đổi mật khẩu</h2>
        </Col>
      </Row>
      {/* Gói tập */}
      <div className="package-info pb-4">
        <div className="d-flex mb-3 align-items-center justify-content-between">
          <p className="my-auto me-2 selected-date">
            Mật khẩu cũ<span>*</span>
          </p>
          <Input
            placeholder="Nhập mật khẩu cũ"
            className="input-password selected-date"
            type="password"
            name="oldPass"
          />
        </div>
        <div className="d-flex mb-3  align-items-center justify-content-between">
          <p className="my-auto mb-2   me-2 selected-date">
            Mật khẩu mới<span>*</span>
          </p>
          <Input
            placeholder="Nhập mật khẩu mới"
            className="input-password selected-date"
            type="password"
            name="newPass"
          />
        </div>
        <div className="d-flex mb-3  align-items-center justify-content-between">
          <p className="my-auto me-2 selected-date">
            Nhập lại mật khẩu mới<span>*</span>
          </p>
          <Input
            placeholder="Nhập lại mật khẩu mới"
            className="input-password selected-date"
            type="password"
            name="replyPass"
          />
        </div>
      </div>
      <Row>
        <Col xs="12" className="d-flex justify-content-center">
          <Button className="btn-reverse mx-auto">Đổi mật khẩu</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangePassword;
