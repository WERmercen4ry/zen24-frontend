import React, { useState, useEffect, useContext } from "react";
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
import { LoaderContext } from "../../../layouts/loader/LoaderContext";
const Location = ({ isOpen, onDone, toggle, isEdit, locationData }) => {
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const [errorAPI, setErrorAPI] = useState("");
  const [location, setLocation] = useState({
    _id: "",
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (!isEdit) {
      setLocation({
        name: "",
        address: "",
        phone: "",
      });
    } else {
      setLocation(locationData);
    }
    setErrors({
      name: "",
      address: "",
      phone: "",
    });
    setErrorAPI("");
  }, [isOpen, isEdit, locationData]);

  const [errors, setErrors] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const validate = () => {
    let isValid = true;
    let newErrors = {
      name: "",
      address: "",
      phone: "",
    };

    // Kiểm tra tên (không được để trống)
    if (!location.name) {
      newErrors.name = "Vui lòng nhập tên chi nhánh";
      isValid = false;
    }
    if (!location.address) {
      newErrors.address = "Vui lòng nhập địa chỉ";
      isValid = false;
    }
    if (!location.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
      isValid = false;
    } else if (!/^\d{10,}$/.test(location.phone)) {
      newErrors.phone = "Số điện thoại phải gồm ít nhất 10 chữ số";
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
    var res;
    if (isEdit) {
      // Chỉnh sửa người dùng
      res = await authorizedAxiosinstance.put(
        `${API_ROOT}dashboards/updateLocation?locationId=${location._id}`,
        location
      );
    } else {
      // Thêm mới người dùng
      res = await authorizedAxiosinstance.post(
        `${API_ROOT}dashboards/createLocation`,
        location
      );
    }
    if (res.status !== 200 && res.status !== 201) {
      setErrorAPI(res.response?.data?.message);
    } else {
      toggle();
      onDone(isEdit);
    }
    hideLoader();
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocation({
      ...location,
      [name]: value,
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{isEdit ? "Chỉnh sửa chi nhánh" : " Thêm mới chi nhánh"}</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {errorAPI && <Alert color="danger">{errorAPI}</Alert>}
          <FormGroup>
            <Label for="name">Tên chi nhánh</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={location.name}
              onChange={handleInputChange}
              invalid={!!errors.name}
            />
            <FormFeedback>{errors.name}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="address">Địa chỉ</Label>
            <Input
              type="text"
              name="address"
              id="address"
              value={location.address}
              onChange={handleInputChange}
              invalid={!!errors.address}
            />
            <FormFeedback>{errors.address}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="phone">Số điện thoại</Label>
            <Input
              type="text"
              name="phone"
              id="phone"
              value={location.phone}
              onChange={handleInputChange}
              invalid={!!errors.phone}
            />
            <FormFeedback>{errors.phone}</FormFeedback>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit" className="me-1">
          {isEdit ? "Chỉnh sửa" : " Thêm mới"}
          </Button>
          <Button color="secondary" onClick={toggle}>
            Hủy
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
export default Location;
