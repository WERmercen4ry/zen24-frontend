import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  FormFeedback,
  Input,
  FormGroup,
  Label,
  Form,
} from "reactstrap";
import React, { useState } from "react";

const UpdateUser = () => {
  const [formData, setFormData] = useState({
    avatar: "",
    name: "",
    birthDate: "",
    gender: "",
    cityName: "",
    weight: 0,
    height: 0,
    targetTrain: "",
    medicalHistory: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Data:", formData);
      // Xử lý lưu trữ hoặc API call ở đây
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      avatar: e.target.files[0],
    });
  };

  return (
    <Container className="workout-history mt-2 card-content">
      <Form onSubmit={handleSubmit}>
        <Row form="true">
          <Col md={12} className="text-center">
            <FormGroup>
              <Label for="avatar">Avatar *</Label>
              <div className="avatar-upload">
                <Input
                  type="file"
                  id="avatar"
                  name="avatar"
                  onChange={handleFileChange}
                  invalid={!!errors.avatar}
                  className="d-none"
                />
                <label className="avatar-placeholder" htmlFor="avatar">
                  <img
                    src="https://vcdn1-dulich.vnecdn.net/2021/07/16/1-1626437591.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=i2M2IgCcw574LT-bXFY92g"
                    alt="Avatar"
                    className="avatar-image"
                    style={{
                      borderRadius: "50%",
                      width: "150px",
                      height: "150px",
                    }}
                  />
                </label>
                {errors.avatar && <FormFeedback>{errors.avatar}</FormFeedback>}
              </div>
              <small className="form-text text-muted">
                Set the product avatar. Only *.png, *.jpg and *.jpeg image files
                are accepted
              </small>
            </FormGroup>
            <strong>Thông tin cá nhân</strong>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="name">Họ và tên</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled
              />
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="birthDate">Ngày Sinh *</Label>
              <Input
                type="date"
                name="birthDate"
                id="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
              />
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="gender">Giới Tính *</Label>
              <Input
                type="select"
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Giới tính</option>
                <option value="Chi nhánh 1">Nam</option>
                <option value="Chi nhánh 2">Nữ</option>
              </Input>
              {errors.branch && <FormFeedback>{errors.branch}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="cityName">Tỉnh/ TP sinh sống</Label>
              <Input
                type="select"
                name="cityName"
                id="cityName"
                value={formData.cityName}
                onChange={handleInputChange}
              >
                <option value="">Tỉnh/ Thành Phố</option>
                <option value="TP Hồ Chí Minh">TP Hồ Chí Minh</option>
                <option value="TP Hà Nội">TP Hà Nội</option>
              </Input>
              {errors.branch && <FormFeedback>{errors.branch}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col md={12}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="weight">Cân Nặng</Label>
                  <Input
                    type="text"
                    name="weight"
                    id="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="kg"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="height">Chiều Cao</Label>
                  <Input
                    type="text"
                    name="height"
                    id="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="cm"
                  />
                </FormGroup>
              </Col>
            </Row>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="goals">Mục Tiêu Luyện Tập</Label>
              <Input
                type="textarea"
                name="goals"
                id="goals"
                value={formData.targetTrain}
                onChange={handleInputChange}
                placeholder="Vd: Giảm cân, tăng vòng 3"
              />
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="medicalHistory">Tiểu Sử Bệnh Lý</Label>
              <Input
                type="textarea"
                name="medicalHistory"
                id="medicalHistory"
                value={formData.targetTrain}
                onChange={handleInputChange}
                placeholder="Vd: Huyết áp, Tim mạch"
              />
            </FormGroup>
          </Col>
          <Col
            md={12}
            className="d-flex align-items-center justify-content-end"
          >
            <Button color="primary" type="submit" className="mb-4">
              Lưu
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default UpdateUser;
