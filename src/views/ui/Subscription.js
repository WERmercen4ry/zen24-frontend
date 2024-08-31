import React, { useState } from 'react';
import { Table, Button, Form, FormGroup, Label, Input, Col, Row, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import "../../assets/scss/layout/subscription.scss";
import { Link } from "react-router-dom";
const Subscription = () => {
    const [activeTab, setActiveTab] = useState('1');

    const toggleTab = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    // Dữ liệu mẫu cho form đăng ký
    const [formData, setFormData] = useState({
        package: '',
        startDate: '',
        endDate: '',
        amount: 0,
        sessions: 1,
        amountPerSession: 0,
    });

    // Dữ liệu mẫu cho bảng danh sách gói tập
    const registeredPackages = [
        {
            type: "Gói thường",
            totalSessions: 24,
            remainingSessions: 23,
            packageName: "Pilates 1-4",
            amount: "6.000.000 đ",
            startDate: "26-08-2024",
            endDate: "25-11-2024"
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <Row>
            <Col>
                <div className="timetable-content">
                    <div >
                        <div className="timetable-header">
                            <h4>Đăng ký gói</h4>
                            <Link to={'/customers-manager'}>
                                <Button className="btn" outline color="secondary">
                                ← Trở về</Button>
                            </Link>

                        </div>
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={activeTab === '1' ? 'active' : ''}
                                    onClick={() => { toggleTab('1'); }}
                                >
                                    Đăng ký gói tập
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={activeTab === '2' ? 'active' : ''}
                                    onClick={() => { toggleTab('2'); }}
                                >
                                    Danh sách Gói Tập
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                <Form className="">
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="package">Gói *</Label>
                                                <Input
                                                    type="select"
                                                    name="package"
                                                    id="package"
                                                    value={formData.package}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Chọn gói</option>
                                                    <option value="Pilates 1-4">Pilates 1-4</option>
                                                    <option value="Yoga 1-4">Yoga 1-4</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="startDate">Ngày Bắt Đầu *</Label>
                                                <Input
                                                    type="date"
                                                    name="startDate"
                                                    id="startDate"
                                                    value={formData.startDate}
                                                    onChange={handleInputChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="endDate">Ngày Kết Thúc *</Label>
                                                <Input
                                                    type="date"
                                                    name="endDate"
                                                    id="endDate"
                                                    value={formData.endDate}
                                                    onChange={handleInputChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="amount">Số Tiền *</Label>
                                                <Input
                                                    type="number"
                                                    name="amount"
                                                    id="amount"
                                                    value={formData.amount}
                                                    onChange={handleInputChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="sessions">Số Buổi *</Label>
                                                <Input
                                                    type="number"
                                                    name="sessions"
                                                    id="sessions"
                                                    value={formData.sessions}
                                                    onChange={handleInputChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="amountPerSession">Số tiền/Buổi *</Label>
                                                <Input
                                                    type="number"
                                                    name="amountPerSession"
                                                    id="amountPerSession"
                                                    value={formData.amountPerSession}
                                                    onChange={handleInputChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <div className="btn-form">
                                        <Button color="primary" className="mt-2 btn">Thêm mới</Button>
                                    </div>
                                </Form>
                            </TabPane>
                            <TabPane tabId="2">
                                <Table >
                                    <thead>
                                        <tr>
                                            <th>Loại gói</th>
                                            <th>Tổng Số Buổi</th>
                                            <th>Còn Lại</th>
                                            <th>Tên Gói</th>
                                            <th>Số tiền</th>
                                            <th>Ngày Bắt Đầu</th>
                                            <th>Ngày Kết Thúc</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {registeredPackages.map((pkg, index) => (
                                            <tr key={index}>
                                                <td>{pkg.type}</td>
                                                <td>{pkg.totalSessions}</td>
                                                <td>{pkg.remainingSessions}</td>
                                                <td>{pkg.packageName}</td>
                                                <td>{pkg.amount}</td>
                                                <td>{pkg.startDate}</td>
                                                <td>{pkg.endDate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </TabPane>
                        </TabContent>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default Subscription;
