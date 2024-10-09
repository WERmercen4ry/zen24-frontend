import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Container,
  Row,
  Col,
  Alert,
} from "reactstrap";
import "../../../assets/scss/layout/user_page.scss";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";
import ConfirmPopup from "../../../layouts/user/ConfirmPopup";
const ChangePassword = () => {
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const [errorAPI, setErrorAPI] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isConfirm, setIsConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    userId: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const toggle = () => setIsOpen(!isOpen);
  useEffect(() => {
    setPasswordData({
      userId: localStorage.getItem("userId") || "",
    });
  }, []);

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [formPopupConfirm, setFormPopupConfirm] = useState({
    message: "",
    title: "",
  });
  const handleConfirm = () => {
    toggle();
  };
  const validate = () => {
    let isValid = true;
    let newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    };

    // Kiểm tra tên (không được để trống)
    if (!passwordData.oldPassword) {
      newErrors.oldPassword = "Mục này không được để trống";
      isValid = false;
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = "Mục này không được để trống";
      isValid = false;
    }
    if (!passwordData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Mục này không được để trống";
      isValid = false;
    }
    if (passwordData.confirmNewPassword !== passwordData.newPassword) {
      newErrors.confirmNewPassword = "Mật khẩu mới đang không giống nhau";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }
    showLoader();
    const res = await authorizedAxiosinstance.post(
      `${API_ROOT}users/change-password`,
      passwordData
    );
    if (res.status !== 200) {
      setErrorAPI(res.response?.data?.message);
    } else {
      setFormPopupConfirm({
        ...formPopupConfirm,
        message: "Thay đổi mật khẩu thành công!",
        title: "Thông báo",
      });
      toggle();
    }
    hideLoader();
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };
  return (
    <Container className="workout-history mt-2 card-content">
      <Row>
        <Col className="text-center">
          <h2 className="history-title">Đổi mật khẩu</h2>
        </Col>
      </Row>
      <ConfirmPopup
        isOpen={isOpen}
        toggle={toggle}
        onConfirm={handleConfirm}
        isConfirm={isConfirm}
        title={formPopupConfirm.title}
        message={formPopupConfirm.message}
      />
      {/* Gói tập */}
      <Form onSubmit={handleSubmit}>
        <div className="package-info pb-4">
          <div className=" mb-3 align-items-center">
            {errorAPI && <Alert color="danger">{errorAPI}</Alert>}
            <FormGroup className="d-flex justify-content-between">
              <Label for="oldPassword">
                Mật khẩu cũ <span className="require-input">*</span>
              </Label>
              <div className="w-50">
                <Input
                  className="w-100"
                  type="password"
                  name="oldPassword"
                  id="oldPassword"
                  value={passwordData.oldPassword || ""}
                  onChange={handleInputChange}
                  invalid={!!errors.oldPassword}
                />
                <FormFeedback>{errors.oldPassword}</FormFeedback>
              </div>
            </FormGroup>
            <FormGroup className="d-flex justify-content-between">
              <Label for="newPassword">
                Mật khẩu mới <span className="require-input">*</span>
              </Label>
              <div className="w-50">
                <Input
                  className="w-100"
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={passwordData.newPassword || ""}
                  onChange={handleInputChange}
                  invalid={!!errors.newPassword}
                />
                <FormFeedback>{errors.newPassword}</FormFeedback>
              </div>
            </FormGroup>
            <FormGroup className="d-flex justify-content-between ">
              <Label for="confirmNewPassword">
                Nhập lại mật khẩu mới <span className="require-input">*</span>
              </Label>
              <div className="w-50">
                <Input
                  className="w-100"
                  type="password"
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  value={passwordData.confirmNewPassword || ""}
                  onChange={handleInputChange}
                  invalid={!!errors.confirmNewPassword}
                />
                <FormFeedback>{errors.confirmNewPassword}</FormFeedback>
              </div>
            </FormGroup>
          </div>
        </div>
        <Row>
          <Col xs="12" className="d-flex justify-content-center">
            <Button className="btn-reverse mx-auto">Đổi mật khẩu</Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default ChangePassword;
