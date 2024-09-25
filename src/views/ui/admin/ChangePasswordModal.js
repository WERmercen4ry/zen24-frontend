import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Alert,
} from "reactstrap";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";

const ChangePasswordModal = ({ isOpen, toggle }) => {
  const [errorAPI, setErrorAPI] = useState("");
  const [passwordData, setPasswordData] = useState({
    userId: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setErrors({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setErrorAPI("");
    } else{
      setPasswordData({
        userId: localStorage.getItem("userId") || ""
      });
    }

  }, [isOpen]);

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

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
    if (passwordData.confirmNewPassword !== passwordData.newPassword){
      newErrors.confirmNewPassword = "Mật khẩu mới đang không giống nhau";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e)=> {
    e.preventDefault();

    if (!validate()) {
      return;
    }
    const res = await authorizedAxiosinstance.post(
      `${API_ROOT}users/change-password`,
      passwordData
    );
    console.log(res);
    if (res.status !== 200) {
      setErrorAPI(res.response?.data?.message);
    } else {
      toggle();
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Đổi Mật Khẩu</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {errorAPI.length > 0 && <Alert color="danger">{errorAPI}</Alert>}
          <FormGroup>
            <Label for="oldPassword">Mật khẩu cũ</Label>
            <Input
              type="password"
              name="oldPassword"
              id="oldPassword"
              value={passwordData.oldPassword}
              onChange={handleInputChange}
              invalid={!!errors.oldPassword}
            />
            <FormFeedback>{errors.oldPassword}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="newPassword">Mật khẩu mới</Label>
            <Input
              type="password"
              name="newPassword"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={handleInputChange}
              invalid={!!errors.newPassword}
            />
            <FormFeedback>{errors.newPassword}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="confirmNewPassword">Nhập lại mật khẩu mới</Label>
            <Input
              type="password"
              name="confirmNewPassword"
              id="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handleInputChange}
              invalid={!!errors.confirmNewPassword}
            />
            <FormFeedback>{errors.confirmNewPassword}</FormFeedback>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit" className="me-1" >
            Đổi Mật Khẩu
          </Button>
          <Button color="secondary" onClick={toggle}>
            Hủy
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
export default ChangePasswordModal;
