

import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Row, Col, FormFeedback } from 'reactstrap';
import "../../assets/scss/layout/user.scss";
import { Link } from "react-router-dom";
const UserForm = () => {
    const [formData, setFormData] = useState({
        avatar: '',
        branch: '',
        phoneNumber: '',
        accountType: '',
        birthDate: '',
        fullName: '',
        gender: '',
        weight: '',
        height: '',
        email: '',
        employee: '',
        goals: '',
        city: '',
        district: '',
        ward: ''
    });

    const [errors, setErrors] = useState({});

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

    const validate = () => {
        let newErrors = {};
        if (!formData.branch) newErrors.branch = 'Vui lòng chọn chi nhánh';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
        if (!formData.accountType) newErrors.accountType = 'Vui lòng chọn loại tài khoản';
        if (!formData.fullName) newErrors.fullName = 'Vui lòng nhập họ tên';
        if (!formData.gender) newErrors.gender = 'Vui lòng chọn giới tính';
        if (!formData.city) newErrors.city = 'Vui lòng chọn thành phố';
        if (!formData.district) newErrors.district = 'Vui lòng chọn quận/huyện';
        if (!formData.ward) newErrors.ward = 'Vui lòng chọn xã/phường';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Form Data:', formData);
            // Xử lý lưu trữ hoặc API call ở đây
        }
    };

    return (
        <div className="user-form-container">
            <div className="timetable-header">
                <h3>Thêm mới người dùng</h3>
                <Link to={'/customers-manager'}>
                    <Button className="btn mx-auto my-auto" outline color="secondary">
                        ← Trở về</Button>
                </Link>

            </div>
            <Form onSubmit={handleSubmit}>
                <Row form>
                    <Col md={3} className="text-center">
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
                                    <img src="https://via.placeholder.com/150" alt="Avatar" className="avatar-image" />

                                </label>
                                {errors.avatar && <FormFeedback>{errors.avatar}</FormFeedback>}
                            </div>
                            <small className="form-text text-muted">
                                Set the product avatar. Only *.png, *.jpg and *.jpeg image files are accepted
                            </small>
                        </FormGroup>
                    </Col>
                    <Col md={9}>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="branch">Chi Nhánh *</Label>
                                    <Input
                                        type="select"
                                        name="branch"
                                        id="branch"
                                        value={formData.branch}
                                        onChange={handleInputChange}
                                        invalid={!!errors.branch}
                                    >
                                        <option value="">Chọn chi nhánh</option>
                                        <option value="Chi nhánh 1">Chi nhánh 1</option>
                                        <option value="Chi nhánh 2">Chi nhánh 2</option>
                                    </Input>
                                    {errors.branch && <FormFeedback>{errors.branch}</FormFeedback>}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="phoneNumber">Số Điện Thoại *</Label>
                                    <Input
                                        type="text"
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        invalid={!!errors.phoneNumber}
                                    />
                                    {errors.phoneNumber && <FormFeedback>{errors.phoneNumber}</FormFeedback>}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <FormGroup>
                                    <Label>Loại Tài Khoản *</Label>
                                    <div>
                                        <Label check className='pe-2'>
                                            <Input
                                                type="radio"
                                                name="accountType"
                                                value="TRAINER"
                                                checked={formData.accountType === 'TRAINER'}
                                                onChange={handleInputChange}
                                                invalid={!!errors.accountType}
                                            />{' '}
                                            Trainer
                                        </Label>
                                        <Label check className="ml-4 pe-2">
                                            <Input
                                                type="radio"
                                                name="accountType"
                                                value="STUDENT"
                                                checked={formData.accountType === 'STUDENT'}
                                                onChange={handleInputChange}
                                                invalid={!!errors.accountType}
                                            />{' '}
                                            Student
                                        </Label>
                                    </div>
                                    {errors.accountType && <FormFeedback>{errors.accountType}</FormFeedback>}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="fullName">Họ Tên *</Label>
                                    <Input
                                        type="text"
                                        name="fullName"
                                        id="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        invalid={!!errors.fullName}
                                    />
                                    {errors.fullName && <FormFeedback>{errors.fullName}</FormFeedback>}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="birthDate">Ngày Sinh</Label>
                                    <Input
                                        type="date"
                                        name="birthDate"
                                        id="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <FormGroup>
                                    <Label>Giới Tính *</Label>
                                    <div>
                                        <Label check className='pe-2'>
                                            <Input
                                                type="radio"
                                                name="gender"
                                                value="Nam"
                                                checked={formData.gender === 'Nam'}
                                                onChange={handleInputChange}
                                                invalid={!!errors.gender}
                                            />{' '}
                                            Nam
                                        </Label>
                                        <Label check className="ml-4 pe-2">
                                            <Input
                                                type="radio"
                                                name="gender"
                                                value="Nữ"
                                                checked={formData.gender === 'Nữ'}
                                                onChange={handleInputChange}
                                                invalid={!!errors.gender}
                                            />{' '}
                                            Nữ
                                        </Label>
                                        <Label check className="ml-4 pe-2">
                                            <Input
                                                type="radio"
                                                name="gender"
                                                value="Khác"
                                                checked={formData.gender === 'Khác'}
                                                onChange={handleInputChange}
                                                invalid={!!errors.gender}
                                            />{' '}
                                            Khác
                                        </Label>
                                    </div>
                                    {errors.gender && <FormFeedback>{errors.gender}</FormFeedback>}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="weight">Cân nặng</Label>
                                    <Input
                                        type="number"
                                        name="weight"
                                        id="weight"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="height">Chiều Cao</Label>
                                    <Input
                                        type="number"
                                        name="height"
                                        id="height"
                                        value={formData.height}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="email">Email</Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="employee">Nhân viên</Label>
                                    <Input
                                        type="text"
                                        name="employee"
                                        id="employee"
                                        value={formData.employee}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="goals">Mô Tả Mục Tiêu</Label>
                                    <Input
                                        type="textarea"
                                        name="goals"
                                        id="goals"
                                        value={formData.goals}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <h4>Chọn Tỉnh Thành</h4>
                <Row>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="city">Thành Phố *</Label>
                            <Input
                                type="select"
                                name="city"
                                id="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                invalid={!!errors.city}
                            >
                                <option value="">Chọn thành phố</option>
                                <option value="Hà Nội">Hà Nội</option>
                                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                            </Input>
                            {errors.city && <FormFeedback>{errors.city}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="district">Quận, Huyện *</Label>
                            <Input
                                type="select"
                                name="district"
                                id="district"
                                value={formData.district}
                                onChange={handleInputChange}
                                invalid={!!errors.district}
                            >
                                <option value="">Chọn quận, huyện</option>
                                <option value="Quận 1">Quận 1</option>
                                <option value="Quận 2">Quận 2</option>
                            </Input>
                            {errors.district && <FormFeedback>{errors.district}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="ward">Xã, Phường *</Label>
                            <Input
                                type="select"
                                name="ward"
                                id="ward"
                                value={formData.ward}
                                onChange={handleInputChange}
                                invalid={!!errors.ward}
                            >
                                <option value="">Chọn xã, phường</option>
                                <option value="Phường 1">Phường 1</option>
                                <option value="Phường 2">Phường 2</option>
                            </Input>
                            {errors.ward && <FormFeedback>{errors.ward}</FormFeedback>}
                        </FormGroup>
                    </Col>
                </Row>
                <div className="btn-form">
                    <Button color="primary" type="submit">Thêm mới</Button>
                </div>
            </Form>
        </div>
    );
};

export default UserForm;
