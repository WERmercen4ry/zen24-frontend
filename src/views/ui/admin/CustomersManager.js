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
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import "../../../assets/scss/layout/customersManager.scss";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { API_ROOT } from "../../../utils/constant.js";
import authorizedAxiosinstance from "../../../utils/authorizedAxios.js";
import CreateMultiClass from "./CreateMultiClass.js";

const CustomersManager = () => {
  const [data, setData] = useState([]);

  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5); // State to manage the selected limit
  const [totalPayments, setTotalPayments] = useState(0);
  const [textUrl, setTextUrl] = useState("users/getAllUser");

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
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {}, [data]);

  useEffect(() => {
    fetchData();
  }, [textUrl]);

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  const fetchData = async (page, limit) => {
    try {
      const res = await authorizedAxiosinstance.get(`${API_ROOT}${textUrl}`, {
        params: {
          page: page,
          limit: limit,
        },
      });

      setData(res.data.users);
      setFilteredData(res.data.users);
      setTotalPages(res.data.totalPages);
      setTotalPayments(res.data.totalUsers);
    } catch (error) {
      throw error;
    }
  };

  const getExpiringUsersClick = () => {
    setTextUrl("dashboards/expiring-packages");
  };

  const getOverDueUsersClick = () => {
    setTextUrl("dashboards/overdue-packages");
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
      const latestEndDate = new Date(latestPackage?.end_date);

      const currentEndDate = new Date(pkg?.end_date);

      if (currentEndDate > latestEndDate) {
        latestPackage = pkg;
      }
    }
    return latestPackage?.end_date?.split("T")[0];
  };

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
      <CreateMultiClass isOpen={modal} toggle={toggleModal}></CreateMultiClass>
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
              <Link to={"/admin/user"}>
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
              <Button
                className="btn"
                outline
                color="danger"
                size="md"
                onClick={() => getExpiringUsersClick()}
              >
                Tài khoản gần đến giới hạn
              </Button>
              <Button
                className="btn"
                outline
                color="secondary"
                size="md"
                onClick={() => getOverDueUsersClick()}
              >
                Quá ngày không tham gia
              </Button>
            </div>
          </div>

          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                {/* <th>
                  <Input type="checkbox" style={{ cursor: "pointer" }} />
                </th> */}
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
                    {/* <td>
                      <Input type="checkbox" style={{ cursor: "pointer" }} />
                    </td> */}
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
                        <div style={{ color: "red" }}>Chưa có chi nhánh</div>
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
                      <strong>
                        {getLatestEndDatePackage(tData.register_package)}
                      </strong>
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
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
                    <td>
                      <Link
                        to="/admin/user"
                        state={{ userUpdateId: tData._id }}
                      >
                        <Button color="secondary m-auto" size="sm">
                          Edit
                        </Button>
                      </Link>
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
