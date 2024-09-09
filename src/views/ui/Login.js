import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap"; // Import từ Reactstrap
import "../../assets/scss/layout/login.scss";
import picture from "../../assets/images/logos/ZenLogo2.png";
import authorizedAxiosinstance from "../../utils/authorizedAxios";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submitLogIn = async (e) => {
    e.preventDefault();
    try {
      const res = await authorizedAxiosinstance.post(
        `http://localhost:8017/v1/users/login`,
        formData
      );

      const userProfile = {
        profile: res.data.profile,
      };
      localStorage.setItem("profile", JSON.stringify(userProfile));
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("userRole", res.data.role);
      if(res.data.role === "Admin"){
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
       setError("Tài khoản và mật khẩu không chính xác. Vui lòng thử lại.");

    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="login-container">
      <div className="form-img">
        <img src={picture} alt="logo" className="img" />
        <span className="title">Zen Pilates</span>
      </div>
      <Form className="form" onSubmit={submitLogIn}>
              {/* Hiển thị thông báo lỗi nếu có */}
      {error.length > 0 && <Alert color="danger">{error}</Alert>}
        <FormGroup className="flex-column">
          <Label className="label" for="username">
            Email
          </Label>
          <div className="inputForm">
            <svg
              height="20"
              viewBox="0 0 32 32"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Layer_3" data-name="Layer 3">
                <path d="..."></path>
              </g>
            </svg>
            <Input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className="input"
            />
          </div>
        </FormGroup>

        <FormGroup className="flex-column">
          <Label className="label" for="password">
            Password
          </Label>
          <div className="inputForm">
            <svg
              height="20"
              viewBox="-64 0 512 512"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="..."></path>
            </svg>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="input"
            />
          </div>
        </FormGroup>

        <div className="flex-row">
          <div>
            <Input type="checkbox" id="rememberMe" />
            <Label for="rememberMe" className="label">
              Remember me
            </Label>
          </div>
          <span className="span">Forgot password?</span>
        </div>

        <Button color="primary" className="button-submit" type="submit">
          Sign In
        </Button>

      </Form>
    </div>
  );
};

export default Login;
