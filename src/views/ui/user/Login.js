import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, Row } from 'reactstrap';
import '../../../assets/scss/login.scss'
import logo from "../../../assets/images/logos/logo-primary.png";
const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Xử lý logic đăng nhập ở đây
    console.log({ phone, password, rememberMe });
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <img src={logo} alt="FourT Pilates Logo" />
      </div>

      <h2 className="login-title">Đăng nhập</h2>
      <p className="login-welcome">Chào mừng bạn đến với FourT Pilates</p>

      <Form className="login-form" onSubmit={handleLogin}>
        <h3 className="login-form-title">Đăng nhập với Học Viên</h3>

        <FormGroup>
          <Row className="align-items-center">
            <Col xs="1">
              <i className="fa fa-phone login-icon"></i>
            </Col>
            <Col xs="11">
              <Input
                type="text"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Col>
          </Row>
        </FormGroup>

        <FormGroup>
          <Row className="align-items-center">
            <Col xs="1">
              <i className="fa fa-lock login-icon"></i>
            </Col>
            <Col xs="10">
              <Input
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Col>
            <Col xs="1">
              <span className="login-show-password">Hiện</span>
            </Col>
          </Row>
        </FormGroup>

        <FormGroup check inline>
          <Label check>
            <Input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
            Ghi nhớ tài khoản
          </Label>
          <a href="/forgot-password" className="forgot-password">Quên mật khẩu?</a>
        </FormGroup>

        <Button color="primary" type="submit" block className="login-button">
          Đăng nhập
        </Button>
      </Form>

      <p className="login-trainer">Đăng nhập với Huấn Luyện Viên</p>
    </div>
  );
};

export default Login;
