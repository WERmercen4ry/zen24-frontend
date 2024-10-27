import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap"; // Import từ Reactstrap
import "../../assets/scss/layout/login.scss";
import picture from "../../assets/images/logos/ZenLogo2.png";
import authorizedAxiosinstance from "../../utils/authorizedAxios";
import { useNavigate } from "react-router-dom";
import { API_ROOT } from "../../utils/constant";
import Loader from "../../layouts/loader/Loader";
import OtpPopup from "./admin/OtpPopup";
const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      authorizedAxiosinstance
        .get(`${API_ROOT}dashboards/access`)
        .then((res) => {
          // Set the transaction data from the API response
          if (res.data) {
            if (res.data.role === "Admin" || res.data.role === "receptionist") {
              navigate("/admin");
            } else if (res.data.role === "Trainer") {
              navigate("/calendar");
            } else {
              navigate("/");
            }
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePopup = (userInfo) => {
    setShowPopup(!showPopup);
  };

  const validate = () => {
    if (!formData.username || !formData.password) {
      setError("Vui lòng nhập tài khoản, mật khẩu");
      return false;
    } else {
      return true;
    }
  };
  const submitLogIn = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!validate()) {
      setLoading(false);
      return;
    }
    try {
      const res = await authorizedAxiosinstance.post(
        `${API_ROOT}users/login`,
        formData
      );
      if (res.status !== 200) {
        setError(
          res.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại."
        );
        setLoading(false);
      } else {
        const userProfile = {
          profile: res.data.profile,
        };
        localStorage.setItem("avatar", res.data.avatar);
        localStorage.setItem("profile", JSON.stringify(userProfile));
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("userRole", res.data.role);
        localStorage.setItem("userId", res.data.id);

        if (res.data.role === "Admin" || res.data.role === "receptionist") {
          if (res.data.role === "Admin") {
            togglePopup();
          } else {
            navigate("/admin");
          }
        } else if (res.data.role === "Trainer") {
          navigate("/calendar");
        } else {
          navigate("/");
        }
      }
      setLoading(false);
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
      setLoading(false);
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
      {showPopup && (
        <OtpPopup
          show={showPopup}
          handleClose={() => togglePopup({})}
          setLoading={setLoading}
          userInfo={formData}
          title="My Pop-up"
        />
      )}
      {loading && <Loader />}
      <div className="form-img">
        <img src={picture} alt="logo" className="img" />
        <span className="title">Zen Pilates</span>
      </div>
      <Form className="form" onSubmit={submitLogIn}>
        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <Alert color="danger">{error}</Alert>}
        <FormGroup className="flex-column">
          <Label className="label" for="username">
            Username
          </Label>
          <div className="inputForm">
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
        </div>

        <Button color="primary" className="button-submit" type="submit">
          Sign In
        </Button>
      </Form>
    </div>
  );
};

export default Login;
