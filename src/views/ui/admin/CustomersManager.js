import {
  Input,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Table,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import user1 from "../../../assets/images/users/user1.jpg";
import user2 from "../../../assets/images/users/user2.jpg";
import user3 from "../../../assets/images/users/user3.jpg";
import "../../../assets/scss/layout/customersManager.scss";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { API_ROOT } from "../../../utils/constant.js";
import { useToast } from "../../../layouts/admin/ToastContext";
import { TOAST_TYPES } from "../../../utils/constant";
import authorizedAxiosinstance from "../../../utils/authorizedAxios.js";
// const tableData = [
//   {
//     avatar: user1,
//     name: "LÊ PHAN PHƯƠNG NGUYÊN",
//     agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
//     phoneNumber: "0909760255",
//     accountType: "STUDENT",
//     reserved: false,
//     expirationDate: "25-11-2024",
//     action: 2,
//   },
//   {
//     avatar: user2,
//     name: "LÊ PHAN PHƯƠNG UYÊN",
//     agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
//     phoneNumber: "0909760255",
//     accountType: "STUDENT",
//     reserved: false,
//     expirationDate: "25-11-2024",
//     action: 2,
//   },
//   {
//     avatar: user3,
//     name: "LÊ PHAN PHƯƠNG BẢO",
//     agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
//     phoneNumber: "0909760255",
//     accountType: "STUDENT",
//     reserved: false,
//     expirationDate: "25-11-2024",
//     action: 2,
//   },
//   {
//     avatar: user3,
//     name: "LÊ PHAN PHƯƠNG BẢO",
//     agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
//     phoneNumber: "0909760255",
//     accountType: "STUDENT",
//     reserved: false,
//     expirationDate: "25-11-2024",
//     action: 2,
//   },
//   {
//     avatar: user3,
//     name: "LÊ PHAN PHƯƠNG BẢO",
//     agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
//     phoneNumber: "0909760255",
//     accountType: "STUDENT",
//     reserved: false,
//     expirationDate: "25-11-2024",
//     action: 2,
//   },
//   {
//     avatar: user3,
//     name: "LÊ PHAN PHƯƠNG BẢO",
//     agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
//     phoneNumber: "0909760255",
//     accountType: "STUDENT",
//     reserved: false,
//     expirationDate: "25-11-2024",
//     action: 2,
//   },
//   {
//     avatar: user3,
//     name: "LÊ PHAN PHƯƠNG BẢO",
//     agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
//     phoneNumber: "0909760255",
//     accountType: "STUDENT",
//     reserved: false,
//     expirationDate: "25-11-2024",
//     action: 2,
//   },
//   {
//     avatar: user3,
//     name: "LÊ PHAN PHƯƠNG BẢO",
//     agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
//     phoneNumber: "0909760255",
//     accountType: "STUDENT",
//     reserved: false,
//     expirationDate: "25-11-2024",
//     action: 2,
//   },
//   {
//     avatar: user3,
//     name: "LÊ PHAN PHƯƠNG BẢO",
//     agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
//     phoneNumber: "0909760255",
//     accountType: "STUDENT",
//     reserved: false,
//     expirationDate: "25-11-2024",
//     action: 2,
//   },
//   {
//     avatar: user3,
//     name: "LÊ PHAN PHƯƠNG BẢO",
//     agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
//     phoneNumber: "0909760255",
//     accountType: "STUDENT",
//     reserved: false,
//     expirationDate: "25-11-2024",
//     action: 2,
//   },
//   {
//     avatar: user3,
//     name: "LÊ PHAN PHƯƠNG BẢO",
//     agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
//     phoneNumber: "0909760255",
//     accountType: "STUDENT",
//     reserved: false,
//     expirationDate: "25-11-2024",
//     action: 2,
//   },
// ];

const CustomersManager = () => {
  const [modal, setModal] = useState(false);

  const [data, setData] = useState([]);

  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5); // State to manage the selected limit
  const [totalPayments, setTotalPayments] = useState(0);

  // Hàm tìm kiếm
  const searchByNameOrPhone = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = data.filter(
      (user) =>
        user.profile.name.toLowerCase().includes(term) ||
        user.profile.phone.includes(term)
    );

    setFilteredData(filtered);
    console.log(filteredData);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { showToast } = useToast();

  const fetchData = async (page, limit) => {
    try {
      const res = await authorizedAxiosinstance.get(
        `${API_ROOT}users/getAllUser`,
        {
          params: {
            page: page,
            limit: limit,
          },
        }
      );
      setData(res.data.users);
      setFilteredData(res.data.users);
      setTotalPages(res.data.totalPages);
      setTotalPayments(res.data.totalUsers);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchData(currentPage, limit);
  }, [currentPage, limit]);

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page when limit changes
  };

  const getLatestEndDatePackage = (packages) => {
    if (!packages || packages.length === 0) {
      return null;
    }

    let latestPackage = packages[0];

    for (const pkg of packages) {
      const latestEndDate = new Date(
        latestPackage.register_package[0].end_date
      );
      const currentEndDate = new Date(pkg.register_package[0].end_date);

      if (currentEndDate > latestEndDate) {
        latestPackage = pkg;
      }
    }

    return latestPackage.register_package[0].end_date.split("T")[0];
  };
  const dummyData = [
    {
      trainer: "Nguyễn Văn Thanh Dư",
      totalStudents: 8,
      studentCount: 5,
      type: "Pilates",
      branch: "1. FOURT PILATES - Số 6, Đường 10, KĐT Hà Đô",
      day: "Thứ 2",
      date: "26/09/2024",
      startTime: "19:00",
      endTime: "20:00",
    },
  ];
  const toggle = () => setModal(!modal);

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalPayments);

  const navigate = useNavigate();
  const goToPackageScreen = (packages, userId) => {
    navigate("/admin/packages", {
      state: { packages: packages, userId: userId },
    });
  };

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} size="xl">
        <ModalHeader toggle={toggle}>Tạo Lịch Tập</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="branch">Lọc chi nhánh:</Label>
                <Input type="select" name="branch" id="branch">
                  <option>Ẩn tất cả</option>
                  <option>Chi nhánh 1</option>
                  <option>Chi nhánh 2</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="trainer">Tìm kiếm huấn luyện viên:</Label>
                <Input type="select" name="trainer" id="trainer">
                  <option>Tất cả</option>
                  <option>Nguyễn Văn A</option>
                  <option>Trần Thị B</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="classType">Lọc loại hình lớp:</Label>
                <Input type="select" name="classType" id="classType">
                  <option>Tất cả</option>
                  <option>Pilates</option>
                  <option>Yoga</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="filterDate">Lọc ngày:</Label>
                <Input type="date" name="filterDate" id="filterDate" />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="filterTime">Lọc thời gian:</Label>
                <Input type="select" name="filterTime" id="filterTime">
                  <option>Tất cả</option>
                  <option>Buổi sáng</option>
                  <option>Buổi chiều</option>
                  <option>Buổi tối</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={10}>
              <FormGroup check inline>
                <Label className="px-4 ps-0" check>
                  <Input type="checkbox" /> Thứ 2
                </Label>
                <Label className="px-4" check>
                  <Input type="checkbox" /> Thứ 3
                </Label>
                <Label className="px-4" check>
                  <Input type="checkbox" /> Thứ 4
                </Label>
                <Label className="px-4" check>
                  <Input type="checkbox" /> Thứ 5
                </Label>
                <Label className="px-4" check>
                  <Input type="checkbox" /> Thứ 6
                </Label>
                <Label className="px-4" check>
                  <Input type="checkbox" /> Thứ 7
                </Label>
                <Label className="px-4" check>
                  <Input type="checkbox" /> Chủ nhật
                </Label>
              </FormGroup>
            </Col>
            <Col md={2} className="d-flex justify-content-end">
              <Button color="primary" onClick={toggle}>
                Xác nhận
              </Button>
            </Col>
          </Row>
          <div className="mt-4">
            <h5 className="text-muted">Tạo lịch tập</h5>
            <Table responsive borderless>
              <thead>
                <tr>
                  <th>
                    <Input type="checkbox" style={{ cursor: "pointer" }} />
                  </th>
                  <th className="text-muted">Huấn luyện viên</th>
                  <th className="text-muted">Tổng học viên</th>
                  <th className="text-muted">Số học viên</th>
                  <th className="text-muted">Loại</th>
                  <th className="text-muted">Chi nhánh</th>
                  <th className="text-muted">Thứ</th>
                  <th className="text-muted">Ngày</th>
                  <th className="text-muted">Thời gian bắt đầu</th>
                  <th className="text-muted">Thời gian kết thúc</th>
                </tr>
              </thead>
              <tbody>
                {dummyData.map((item, index) => (
                  <tr key={index} className="border-top">
                    <td>
                      <Input type="checkbox" style={{ cursor: "pointer" }} />
                    </td>
                    <td className="column-table">{item.trainer}</td>
                    <td className="column-table">{item.totalStudents}</td>
                    <td className="column-table">{item.studentCount}</td>
                    <td className="column-table">{item.type}</td>
                    <td className="column-table">{item.branch}</td>
                    <td className="column-table">{item.day}</td>
                    <td className="column-table">{item.date}</td>
                    <td className="column-table">{item.startTime}</td>
                    <td className="column-table">{item.endTime}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Đóng
          </Button>
          <Button color="primary" onClick={toggle}>
            Lưu thay đổi
          </Button>
        </ModalFooter>
      </Modal>
      <Card>
        <Row className="mt-3">
          <Col>
            <Input
              id="exampleEmail"
              name="email"
              placeholder="Tìm kiếm họ tên và điện thoại"
              type="email"
              className="search-user"
              onChange={searchByNameOrPhone}
            />
          </Col>
          <Col></Col>
          <Col></Col>
          <Col></Col>
        </Row>
        <CardBody>
          <div className="header-user">
            <div>
              <CardTitle tag="h5">
                <strong>Người dùng</strong>
              </CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                Chọn 0 bản ghi
              </CardSubtitle>
            </div>
            <div className="button-user">
              <Link to={"/admin/create-user"}>
                <Button className="btn" color="primary" size="md">
                  + Thêm mới
                </Button>
              </Link>
              <Button
                onClick={toggle}
                className="btn"
                color="primary"
                size="md"
              >
                + Tạo lịch tập
              </Button>
              <Button className="btn" outline color="danger" size="md">
                Tài khoản gần đến giới hạn
              </Button>
              <Button className="btn" outline color="secondary" size="md">
                Quá ngày không tham gia
              </Button>
            </div>
          </div>

          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>
                  <Input type="checkbox" style={{ cursor: "pointer" }} />
                </th>
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Họ Tên
                  </p>
                </th>
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Chi Nhánh
                  </p>
                </th>

                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Số Điện Thoại
                  </p>
                </th>
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Loại Tài Khoản
                  </p>
                </th>
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Avatar
                  </p>
                </th>
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Bảo Lưu
                  </p>
                </th>
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Ngày Hết Hạn
                  </p>
                </th>
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Hành Động
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((tData, index) => (
                  <tr key={index} className="border-top">
                    {/* <td>
                    <div className="d-flex align-items-center p-2">
                      <img
                        src={tdata.avatar}
                        className="rounded-circle"
                        alt="avatar"
                        width="45"
                        height="45"
                      />
                      <div className="ms-3">
                        <h6 className="mb-0">{tdata.name}</h6>
                        <span className="text-muted">{tdata.email}</span>
                      </div>
                    </div>
                  </td> */}
                    <td>
                      <Input type="checkbox" style={{ cursor: "pointer" }} />
                    </td>
                    <td>
                      <strong>{tData.profile.name}</strong>
                    </td>
                    <td>
                      {tData.agency &&
                      Array.isArray(tData.agency) &&
                      tData.agency.length > 0 ? (
                        tData.agency.map((agency) => (
                          <strong>{agency.name}</strong>
                        ))
                      ) : (
                        <div style={{ color: "red" }}>Chưa có có chi nhánh</div>
                      )}
                    </td>
                    <td>
                      <strong>{tData.profile.phone}</strong>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          className="bi bi-person"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "1.2rem", // Kích thước vòng tròn
                            height: "1.2rem", // Kích thước vòng tròn
                            borderRadius: "50%", // Tạo hình tròn
                            backgroundColor:
                              tData.role === "Student" ? "#007bff" : "#28a745", // Màu nền xanh
                            color: "white", // Màu biểu tượng trắng
                            fontSize: "1.2rem", // Kích thước biểu tượng
                            lineHeight: "1",
                            paddingRight: "1px",
                          }}
                        ></i>
                        <strong style={{ paddingLeft: "4px" }}>
                          {tData.role === "Student" ? "STUDENT" : "TRAINER"}
                        </strong>
                      </div>
                    </td>
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
                      {true ? (
                        <span
                          style={{
                            padding: "1px",
                            paddingLeft: "4px",
                            paddingRight: "4px",
                            backgroundColor:
                              tData.role === "Student" ? "#4682B4" : "#dc3545",
                            color: "white", // Giúp văn bản nổi bật trên nền xanh
                            borderRadius: "20px",
                          }}
                        >
                          {tData.role === "Student"
                            ? "Chưa có trạng thái"
                            : "Không có trạng thái"}
                        </span>
                      ) : (
                        <span>Đã bảo lưu</span>
                      )}
                    </td>
                    <td>
                      <strong>{getLatestEndDatePackage(tData.packages)}</strong>
                    </td>
                    <td>
                      {tData.role === "Student" && (
                        <div>
                          <i
                            className="bi bi-gift gift-hover"
                            style={{
                              fontSize: "1.5rem",
                              color: "black",
                              padding: "0.5rem",
                              borderRadius: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              goToPackageScreen(tData.packages, tData._id)
                            }
                          >
                            <span className="action-num">
                              {tData.packages.length}
                            </span>
                          </i>
                        </div>
                      )}
                    </td>
                    {/* <td>
                    {tData.status === "pending" ? (
                      <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                    ) : tData.status === "holt" ? (
                      <span className="p-2 bg-warning rounded-circle d-inline-block ms-3"></span>
                    ) : (
                      <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                    )}
                  </td>
                  <td>{tData.weeks}</td>
                  <td>{tData.budget}</td> */}
                  </tr>
                ))
              ) : (
                <span></span>
              )}
            </tbody>
          </Table>
          <div className="timetable-footer">
            <div className="pagination-container">
              Các mục trên mỗi trang:
              <select
                className="pagination-select"
                value={limit}
                onChange={handleLimitChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <Pagination>
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink first onClick={() => handlePageChange(1)} />
              </PaginationItem>
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink
                  previous
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem active={index + 1 === currentPage} key={index}>
                  <PaginationLink onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink
                  next
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
              <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink
                  last
                  onClick={() => handlePageChange(totalPages)}
                />
              </PaginationItem>
            </Pagination>
            <div>{`${start} - ${end} of ${totalPayments}`}</div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CustomersManager;
