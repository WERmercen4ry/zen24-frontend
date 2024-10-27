import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import "../../../assets/scss/layout/ptInfoPopUp.scss";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";

const OtpPopup = ({ handleClose, setLoading, userInfo }) => {
  const [formData, setFormData] = useState({
    otp: "",
    username: userInfo.username,
    userpass: userInfo.password,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    if (!formData.otp) {
      setError("Vui lòng nhập OTP");
      return false;
    } else {
      return true;
    }
  };

  const submitOTP = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!validate()) {
      setLoading(false);
      return;
    }
    try {
      const res = await authorizedAxiosinstance.post(
        `${API_ROOT}users/verify-otp`,
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
        console.log("res.data.role", res.data.role);
        if (res.data.role === "Admin" || res.data.role === "receptionist") {
          navigate("/admin");
        }
      }
      setLoading(false);
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <span className="popup-close-icon" onClick={handleClose}>
          <FaTimes /> {/* Icon "X" từ react-icons */}
        </span>
        <Form className="otpForm" onSubmit={submitOTP}>
          {error && (
            <Alert color="danger" fade="true">
              {error}
            </Alert>
          )}
          <FormGroup>
            <Label className="label" for="username">
              OTP
            </Label>
            <Input
              type="text"
              name="otp"
              id="otp"
              value={formData.otp}
              onChange={handleInputChange}
            ></Input>
          </FormGroup>
          <Button color="primary" className="button-submit" type="submit">
            Gửi OTP
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default OtpPopup;
