import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  FormFeedback,
} from "reactstrap";
import { Link } from "react-router-dom";
import React, { useState, useContext } from "react";
import "../../../assets/scss/layout/subscription.scss";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";
import { useToast } from "../../../layouts/admin/ToastContext";
import { TOAST_TYPES } from "../../../utils/constant";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";

const CreatePackages = () => {
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    standard: "",
    description: "",
    price: 0,
    type: "",
    duration_in_months: 0,
    max_members: 0,
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addNewPackage = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    showLoader();
    try {
      const reqBody = {
        name: formData.name,
        level: formData.level,
        standard: formData.standard,
        description: formData.description,
        price: formData.price,
        type: formData.type,
        duration_in_months: formData.duration_in_months,
        max_members: formData.max_members,
      };

      const res = await authorizedAxiosinstance.post(
        `${API_ROOT}dashboards/createPackage`,
        reqBody
      );

      if (res?.status === 403 || res?.status === 500) {
        showToast("Thông báo", res.response?.data?.message, TOAST_TYPES.ERROR);
      }

      if (res?.status === 201) {
        setFormData({
          name: "",
          level: "",
          standard: "",
          description: "",
          price: 0,
          type: "",
          duration_in_months: 0,
          max_members: 0,
        });
        showToast("Thông báo", "Thêm gói tập thành công", TOAST_TYPES.SUCCESS);
      }

      hideLoader();
    } catch (error) {
      hideLoader();
      showToast("Thông báo", error, TOAST_TYPES.ERROR);
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name) newErrors.name = "Vui lòng nhập tên gói";

    if (!formData.level) newErrors.level = "Vui lòng nhập cấp độ";

    if (!formData.standard) newErrors.standard = "Vui lòng nhập tiêu chuẩn";

    if (!formData.description) newErrors.description = "Vui lòng nhập mô tả";

    if (!formData.price) newErrors.price = "Vui lòng nhập giá tiền";

    if (!formData.type) newErrors.type = "Vui lòng nhập loại gói";


    if (!formData.max_members)
      newErrors.max_members = "Vui lòng nhập số học viên trong gói";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Row>
      <div className="timetable-content">
        <div>
          <div className="timetable-header">
            <h4>Thêm mới gói</h4>
            <Link to={"/admin/package-manager"}>
              <Button className="btn m-auto" outline color="secondary">
                ← Trở về
              </Button>
            </Link>
          </div>
          <Form className="">
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Tên gói *</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    invalid={!!errors.name}
                  />
                  {errors.name && <FormFeedback>{errors.name}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="level">Cấp độ *</Label>
                  <Input
                    type="text"
                    name="level"
                    id="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    placeholder="VD: 1-1, 1-4, ..."
                    invalid={!!errors.level}
                  />
                  {errors.level && <FormFeedback>{errors.level}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="standard">Tiêu chuẩn *</Label>
                  <Input
                    type="select"
                    name="standard"
                    id="standard"
                    value={formData.standard}
                    onChange={handleInputChange}
                    invalid={!!errors.standard}
                  >
                    <option value="" disabled>
                      Chọn tiêu chuẩn
                    </option>
                    <option value="nền tảng">nền tảng</option>
                    <option value="chuyên sâu">chuyên sâu</option>
                  </Input>
                  {errors.standard && (
                    <FormFeedback>{errors.standard}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="description">Mô tả *</Label>
                  <Input
                    type="text"
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    invalid={!!errors.description}
                  />
                  {errors.description && (
                    <FormFeedback>{errors.description}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="price">Giá tiền *</Label>
                  <Input
                    type="number"
                    name="price"
                    id="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    invalid={!!errors.price}
                  />
                  {errors.price && <FormFeedback>{errors.price}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="type">Loại gói *</Label>
                  <Input
                    type="select"
                    name="type"
                    id="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    invalid={!!errors.type}
                  >
                    <option value="" disabled>
                      Chọn loại gói
                    </option>
                    <option value="Gym">Gym</option>
                    <option value="Pilate">Pilate</option>
                  </Input>
                  {errors.type && <FormFeedback>{errors.type}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="max_members">Số học viên trong gói *</Label>
                  <Input
                    type="number"
                    name="max_members"
                    id="max_members"
                    value={formData.max_members}
                    onChange={handleInputChange}
                    invalid={!!errors.max_members}
                  />
                  {errors.max_members && (
                    <FormFeedback>{errors.max_members}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <div className="btn-form">
              <Button
                color="primary"
                className="mt-2 btn"
                onClick={addNewPackage}
              >
                Thêm mới
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Row>
  );
};

export default CreatePackages;
