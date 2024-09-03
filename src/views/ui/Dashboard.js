import React, { useState } from "react";
import {
  Table,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  CardBody,
} from "reactstrap";
import user1 from "../../assets/images/users/user1.jpg";
import user2 from "../../assets/images/users/user2.jpg";
import user3 from "../../assets/images/users/user3.jpg";
import "../../assets/scss/layout/dashboard.scss";
import trainer from "../../assets/images/logos/student-icon.png";
import student from "../../assets/images/logos/trainer-logo.png";

const tableData = [
  {
    avatar: user1,
    name: "LÊ PHAN PHƯƠNG NGUYÊN",
    dayTrainer: 1,
  },
  {
    avatar: user2,
    name: "LÊ PHAN PHƯƠNG UYÊN",
    dayTrainer: 2,
  },
  {
    avatar: user3,
    name: "LÊ PHAN PHƯƠNG BẢO",
    dayTrainer: 3,
  },
];

const Dashboard = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <Row className="dashboard">
        <Col sm="6" lg="6" xl="7" xxl="8">
          <Card>
            <CardBody>
              <Row>
                <Col md={3}>
                  <FormGroup>
                    <Label for="startDate">Ngày Bắt Đầu</Label>
                    <Input
                      className="date-time"
                      type="date"
                      name="startDate"
                      id="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="endDate">Ngày Kết Thúc</Label>
                    <Input
                      className="date-time"
                      type="date"
                      name="endDate"
                      id="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="desc-total">
                <div className="button-month">
                  <Button color="primary" className="mt-2 btn">
                    <i
                      className="bi bi-folder-check"
                      style={{ paddingRight: "7px" }}
                    ></i>
                    Xuất file lịch sử tập luyện
                  </Button>
                  <Button color="primary" className="mt-2 btn">
                    <i
                      className="bi bi-folder-check"
                      style={{ paddingRight: "7px" }}
                    ></i>
                    Xuất file tổng lớp dạy của HLV
                  </Button>
                </div>
                <span className="title-month">
                  Lịch sử luyện tập trong tháng
                </span>
              </div>
              <Button color="primary" className="mt-2 btn">
                Tháng
              </Button>
              <Table
                className="no-wrap mt-3 align-middle"
                responsive
                borderless
              >
                <thead>
                  <tr>
                    <th>
                      <p className="text-muted" style={{ margin: "0px" }}>
                        Avatar
                      </p>
                    </th>
                    <th>
                      <p className="text-muted" style={{ margin: "0px" }}>
                        Họ Và Tên
                      </p>
                    </th>

                    <th>
                      <p className="text-muted" style={{ margin: "0px" }}>
                        Số Buổi
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((tData, index) => (
                    <tr key={index} className="border-top">
                      <td>
                        <div className="d-flex align-items-center p-2">
                          <img
                            src={tData.avatar}
                            className="rounded-circle"
                            alt="avatar"
                            width="45"
                            height="45"
                          />
                        </div>
                      </td>
                      <td>
                        <strong>{tData.name}</strong>
                      </td>
                      <td>
                        <strong>{tData.dayTrainer} buổi</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
        <Col sm="6" lg="6" xl="5" xxl="4">
          <Card>
            <CardBody>
              <div>
                <div>
                  <span className="title-month">Thống kê tài khoản</span>
                </div>
                <div>
                  <Button color="primary" className="mt-2 btn">
                    <i
                      className="bi bi-folder-check"
                      style={{ paddingRight: "7px" }}
                    ></i>
                    Xuất file theo chi nhánh
                  </Button>
                </div>
                <div style={{ padding: "10px" }}>
                  <span style={{ padding: "5px" }}>
                    Cập nhật lúc: 20:37 26/08/2024
                  </span>
                </div>
              </div>
              <div>
                <Row>
                  <Col md={6}>
                    <div
                      className="d-flex align-items-center p-2"
                      style={{ gap: "5px" }}
                    >
                      <div
                        className="d-flex align-items-center"
                        style={{
                          padding: "3px",
                          backgroundColor: "lightgrey",
                          borderRadius: "10px",
                        }}
                      >
                        <img
                          src={trainer}
                          className="rounded-circle"
                          alt="avatar"
                          width="45"
                          height="45"
                        />
                      </div>
                      <span>Huấn luận viên</span>
                    </div>
                  </Col>
                  <Col md={3} className="num">
                    <span>0</span>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <div
                      className="d-flex align-items-center p-2"
                      style={{ gap: "5px" }}
                    >
                      <div
                        className="d-flex align-items-center"
                        style={{
                          padding: "3px",
                          backgroundColor: "lightgrey",
                          borderRadius: "10px",
                        }}
                      >
                        <img
                          src={student}
                          className="rounded-circle"
                          alt="avatar"
                          width="45"
                          height="45"
                        />
                      </div>
                      <span>Học viên</span>
                    </div>
                  </Col>
                  <Col md={3} className="num">
                    <span>0</span>
                  </Col>
                </Row>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
