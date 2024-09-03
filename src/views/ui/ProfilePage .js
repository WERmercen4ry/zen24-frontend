import "../../assets/scss/layout/profilePage.scss";
import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Button, Progress, Form, FormGroup, Label, Input, Table } from 'reactstrap';
import classnames from 'classnames';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('1');

    const toggleTab = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    // Dữ liệu của Overview
    const profileCompletion = 80;

    // Dữ liệu của ProfileEdit
    const [profileData, setProfileData] = useState({
        avatar: '',
        fullName: 'CN - Hà Đô',
        phoneNumber: '903765607',
        email: 'cnhado@gmail.com',
        birthDate: '1970-01-01',
        gender: 'Nam',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Profile Data:', profileData);
        // Handle save logic here
    };

    // Dữ liệu của Groups
    const groupsData = [
        {
            id: '638f63b7ce76f68a5cdebeb3',
            name: 'Lễ tân các chi nhánh',
            createdAt: '01:23:31 07/12/2022',
            action: 'Chỉnh sửa',
        },
    ];

    return (
        <div>
            <div className="profile-page-container mb-3 pb-0">
                <div className="overview-section">
                    <Row className="align-items-center">
                        <Col md={2} className="text-center">
                            <img src="https://via.placeholder.com/150" alt="Avatar" className="profile-avatar" />
                        </Col>
                        <Col md={7} className="profile-info">
                            <div className="mb-2 d-flex">
                                <h5 className="my-auto">CN - Hà Đô</h5>
                                <button className="link-branches my-auto ms-2">LIÊN TẤN CÁC CHI NHÁNH</button>
                            </div>
                            <div className=" d-flex">
                                <p className="infor-group my-auto"><i class="bi bi-telephone"></i> 903765607</p>
                                <p className="infor-group my-auto"><i class="bi bi-geo-alt-fill"></i> cnhado@gmail.com</p>
                                <p className="infor-group my-auto"><i class="bi bi-envelope"></i> cnhado@gmail.com</p>
                            </div>
                            <div className="mt-3  d-flex">
                                <div className="stats-box">
                                    <div className=" d-flex">
                                        <i class="bi bi-people-fill me-1"></i>
                                        <h5>1</h5>
                                    </div>
                                    <p>Nhóm</p>
                                </div>
                                <div className="stats-box">
                                    <div className=" d-flex">
                                        <i class="bi bi-building me-1"></i>
                                        <h5>0</h5>
                                    </div>
                                    <p>Phòng ban</p>
                                </div>
                                <div className="stats-box">
                                    <div className=" d-flex">
                                        <i class="bi bi-wrench-adjustable me-1"></i>
                                        <h5>0/0</h5>
                                    </div>
                                    <p>Group/API Accesses/Denies</p>
                                </div>
                            </div>
                        </Col>
                        <Col md={3} className="text-right">

                            <Row className="mt-3">
                                <Col>
                                    <div className="d-flex justify-content-between">
                                        <h5 className="my-auto">Hoàn thiện hồ sơ</h5>
                                        <span className="my-auto"><strong> 80% </strong></span>
                                    </div>
                                    <Progress value={profileCompletion} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>

                <Nav tabs className="mt-4">
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '1' }) +" form-label"}
                            onClick={() => { toggleTab('1'); }}
                        >
                            Tổng quan
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '2' }) +" form-label"}
                            onClick={() => { toggleTab('2'); }}
                        >
                            Cài đặt
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '3' }) +" form-label"}
                            onClick={() => { toggleTab('3'); }}
                        >
                            Các nhóm
                        </NavLink>
                    </NavItem>
                </Nav>
            </div>
            <div>
                <TabContent activeTab={activeTab} >

                    <TabPane tabId="1">
                        <div className="profile-detail-container">
                            <div className="profile-header">
                                <h5 className="my-auto">Chi tiết hồ sơ</h5>

                                <Button color="primary me-0" className='m-auto'>
                                    Chỉnh sửa hồ sơ</Button>
                            </div>
                            <div className="border-top profile-overview mt-2 px-4 py-2">
                                <div className="d-flex"><span className="label form-label">Họ tên:</span><p>{profileData.fullName}</p></div>
                                <div className="d-flex"><span className="label form-label">Số điện thoại:</span><p>{profileData.phoneNumber}</p></div>
                                <div className="d-flex"><span className="label form-label">Email: </span><p>{profileData.email}</p></div>
                                <div className="d-flex"><span className="label form-label">Quyền: </span><p>MANAGER</p></div>
                                <div className="d-flex"><span className="label form-label">Giới tính: </span><p>{profileData.gender}</p></div>
                                <div className="d-flex"><span className="label form-label">Liên lạc: </span><p>Email, Phone</p></div>
                                <div className="d-flex"><span className="label form-label">Chế phép thay đổi: </span><p>Đồng ý</p></div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tabId="2">
                        <div className="profile-detail-container">
                            <div className="profile-header">
                                <h5 className="my-auto">Chi tiết hồ sơ</h5>

                            </div>
                            <Form onSubmit={handleSubmit} className="border-top profile-overview mt-2 px-4 py-2">
                                <FormGroup className="profile-detail-edit">
                                    <Label for="avatar my-auto">Avatar *</Label>
                                    <div className="avatar-upload ms-0">
                                        <Input
                                            type="file"
                                            id="avatar"
                                            name="avatar"
                                            className="d-none"
                                        />
                                        <label className="avatar-placeholder" htmlFor="avatar">
                                            <img src="https://via.placeholder.com/150" alt="Avatar" className="avatar-image" />

                                        </label>

                                    </div>
                                </FormGroup>
                                <FormGroup className="profile-detail-edit">
                                    <Label className="my-auto" for="fullName">Họ tên *</Label>
                                    <Input
                                        type="text"
                                        name="fullName"
                                        id="fullName"
                                        value={profileData.fullName}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                                <FormGroup className="profile-detail-edit">
                                    <Label className="my-auto" for="phoneNumber">Số điện thoại *</Label>
                                    <Input
                                        type="text"
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        value={profileData.phoneNumber}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                                <FormGroup className="profile-detail-edit">
                                    <Label className="my-auto" for="email">Email *</Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={profileData.email}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                                <FormGroup className="profile-detail-edit">
                                    <Label className="my-auto" for="birthDate">Ngày sinh</Label>
                                    <Input
                                        type="date"
                                        name="birthDate"
                                        id="birthDate"
                                        value={profileData.birthDate}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                                <FormGroup tag="fieldset" className="profile-detail-edit">
                                    <Label className="my-auto">Giới tính *</Label>
                                    <FormGroup check inline >
                                        <Label check>
                                            <Input
                                                type="radio"
                                                name="gender"
                                                value="Nam"
                                                checked={profileData.gender === 'Nam'}
                                                onChange={handleInputChange}
                                            />{' '}
                                            Nam
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check inline>
                                        <Label check>
                                            <Input
                                                type="radio"
                                                name="gender"
                                                value="Nữ"
                                                checked={profileData.gender === 'Nữ'}
                                                onChange={handleInputChange}
                                            />{' '}
                                            Nữ
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check inline>
                                        <Label check>
                                            <Input
                                                type="radio"
                                                name="gender"
                                                value="Khác"
                                                checked={profileData.gender === 'Khác'}
                                                onChange={handleInputChange}
                                            />{' '}
                                            Khác
                                        </Label>
                                    </FormGroup>
                                </FormGroup>
                                <div className="btn-form">
                                    <Button color="primary" type="submit">
                                        Lưu thay đổi
                                    </Button>
                                </div>
                            </Form>
                        </div>
                        <div className="profile-detail-container mt-3">
                            <div className="profile-header">
                                <h5 className="my-auto">Phương thức đăng nhập</h5>
                            </div>
                            <div className="border-top profile-overview mt-2 px-4 py-2">
                                <div className="d-flex py-1 my-auto"><span className="label form-label">Địa chỉ email:</span><p className="my-auto">{profileData.fullName}</p></div>
                                <div className="d-flex py-1 my-auto">
                                    <span className="label form-label">Mật khẩu:</span>
                                    <div className="d-flex w-100 justify-content-between">
                                        <p className="my-auto">**********</p>
                                        <Button className="btn" color="primary" size="sm" type="submit" disabled>
                                            Cập nhập mật khẩu
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tabId="3" className="">
                        <div className="profile-detail-container">
                            <div className="profile-header">
                                <h5 className="my-auto">Nhóm</h5>
                            </div>
                            <div className="px-4">
                            <Table >
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tiêu đề</th>
                                        <th>Ngày tạo</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupsData.map((group, index) => (
                                        <tr key={index}>
                                            <td>{group.id}</td>
                                            <td>{group.name}</td>
                                            <td>{group.createdAt}</td>
                                            <td><Button color="secondary m-auto" size="sm">Edit</Button>{' '}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            </div>


                        </div>
                    </TabPane>
                </TabContent>
            </div>
        </div>
    );
};

export default ProfilePage;
