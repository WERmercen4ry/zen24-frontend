import { Input, Form, FormGroup, Label, Button } from "reactstrap";
import "../../../assets/scss/layout/ptInfoPopUp.scss";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const OtpPopup = ({ handleClose }) => {
  const [formData, setFormData] = useState({
    otp: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <span className="popup-close-icon" onClick={handleClose}>
          <FaTimes /> {/* Icon "X" từ react-icons */}
        </span>
        <Form>
          <FormGroup>
            <Label className="label" for="username">
              OTP
            </Label>
            <Input
              type="number"
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
