import React, { useEffect, useState, useContext } from "react";
import {
  Table,
  Button,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  Card,
  CardBody,
} from "reactstrap";
import "../../../assets/scss/layout/dashboard.scss";
import trainer from "../../../assets/images/logos/student-icon.png";
import student from "../../../assets/images/logos/trainer-logo.png";
import authorizedAxiosinstance from "../../../utils/authorizedAxios.js";
import { API_ROOT } from "../../../utils/constant.js";
import * as XLSX from "xlsx";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";
import { useToast } from "../../../layouts/admin/ToastContext";
import { TOAST_TYPES } from "../../../utils/constant";
import moment from "moment";
const Dashboard = () => {
  const [totalTrainer, setTotalTrainer] = useState(0);
  const [totalStudent, setTotalStudent] = useState(0);
  const [totalUsers, setTotalUsers] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [currentDate, setCurrentDate] = useState(new Date());
  const [trainingHistory, setTrainingHistory] = useState([]);
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const userRole = localStorage.getItem("userRole");
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    startDate: "",
  });

  const handleExport = () => {
    showLoader();
    const listAgency = [];

    if (totalUsers && totalUsers.length > 0) {
      for (let i = 0; i < totalUsers.length; i++) {
        if (totalUsers[i] && totalUsers[i].agency.length > 0) {
          for (let j = 0; j < totalUsers[i].agency.length; j++) {
            if (!listAgency.includes(totalUsers[i].agency[j].name)) {
              listAgency.push(totalUsers[i].agency[j].name);
            }
          }
        }
      }
    }

    let isError = true;

    const wb = XLSX.utils.book_new();
    for (let i = 0; i < listAgency.length; i++) {
      const data = getDataForExcel(totalUsers, listAgency[i]);
      if (data && Array.isArray(data) && data.length > 0) {
        const ws = XLSX.utils.json_to_sheet(data);

        // Tính toán chiều rộng của mỗi cột
        const maxWidths = [];
        data.forEach((row) => {
          Object.keys(row).forEach((key, index) => {
            const cellValue = row[key] ? row[key].toString() : "";
            maxWidths[index] = Math.max(
              maxWidths[index] || 10,
              cellValue.length + 5
            ); // Cộng thêm 5 để tránh sát chữ
          });
        });

        // Đặt chiều rộng cho từng cột
        ws["!cols"] = maxWidths.map((width) => ({ wch: width }));

        const sheetName = listAgency[i] || `Sheet${i + 1}`;
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        isError = false;
      }
    }

    if (isError) {
      showToast("Thông báo", "Không có dữ liệu", TOAST_TYPES.ERROR);
      hideLoader();
      return;
    }

    XLSX.writeFile(wb, "Du_lieu_nguoi_dung_theo_chi_nhanh.xlsx");
    showToast("Thông báo", "Xuất file thành công", TOAST_TYPES.SUCCESS);
    hideLoader();
  };

  const downloadFile = (base64Data, flg) => {
    try {
      // Xử lý base64
      const base64String = base64Data.replace(
        /^data:application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,/,
        ""
      ); // Xóa prefix nếu có
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }); // MIME type cho file XLSX
      const url = URL.createObjectURL(blob);

      // Tạo liên kết tải xuống và kích hoạt
      const link = document.createElement("a");
      link.href = url;
      link.download =
        flg === true ? "Lich_su_luyen_tap.xlsx" : "Tong_hop_lop_day.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Giải phóng URL sau khi tải xuống
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Lỗi khi tải file từ base64:", error);
    }
  };

  const getDataForExcel = (totalUsers, agencyNm) => {
    const dataSplit = [];
    if (totalUsers && totalUsers.length > 0) {
      for (let i = 0; i < totalUsers.length; i++) {
        if (totalUsers[i] && totalUsers[i].agency.length > 0) {
          for (let j = 0; j < totalUsers[i].agency.length; j++) {
            if (agencyNm === totalUsers[i].agency[j].name) {
              dataSplit.push({
                "Tên người dùng": totalUsers[i].profile.name,
                "Số điện thoại": totalUsers[i].profile.phone,
                "Giới tính": totalUsers[i].profile.sex,
                "Địa chỉ người dùng": totalUsers[i].profile.address,
                "Chức vụ":
                  totalUsers[i].role === "Student"
                    ? "Học viên"
                    : totalUsers[i].role === "Trainer"
                    ? "PT"
                    : totalUsers[i].role === "receptionist"
                    ? "Lễ tân"
                    : "Vai trò không xác định",
                "Tên chi nhánh": totalUsers[i].agency[j].name,
                "Địa chỉ": totalUsers[i].agency[j].address,
              });
            }
          }
        }
      }
    }

    return dataSplit;
  };

  useEffect(() => {
    const { start, end } = getStartAndEndOfMonth(formData.startDate);

    fetchTrainingHistoryByMonth(start, end);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const fetchTrainingHistoryByMonth = async (startDate, endDate) => {
    showLoader();
    try {
      const res = await authorizedAxiosinstance.get(
        `${API_ROOT}dashboards/getTrainingHistory`,
        {
          params: {
            startDate: startDate,
            endDate: endDate,
          },
        }
      );
      if (res.status !== 200) {
        showToast("Thông báo", res.response?.data?.message, TOAST_TYPES.ERROR);
      } else {
        setTrainingHistory(res?.data);
      }

      hideLoader();
    } catch (error) {
      showToast(
        "Thông báo",
        "Có lỗi xảy ra, vui lòng thử lại.",
        TOAST_TYPES.ERROR
      );
      hideLoader();
    }
  };

  function getStartAndEndOfMonth(dateString) {
    let year, month;
    if (!dateString) {
      const currentDate = new Date();
      year = currentDate.getFullYear();
      month = currentDate.getMonth() + 1; // getMonth() trả về giá trị từ 0-11, nên +1
    } else {
      [year, month] = dateString.split("-").map(Number);
    }

    // Ngày bắt đầu của tháng
    const startDate = new Date(Date.UTC(year, month - 1, 1));

    // Ngày kết thúc của tháng
    const endDate = new Date(Date.UTC(year, month, 0));

    // Định dạng lại thành yyyy-mm-dd
    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];

    return { start, end };
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    fetchDataUsers();
    fetchTrainingHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTrainingHistory = async () => {
    try {
      const res = await authorizedAxiosinstance.get(
        `${API_ROOT}dashboards/getTrainingHistory`
      );
      setTrainingHistory(res.data);
    } catch (error) {
      showToast(
        "Thông báo",
        "Có lỗi xảy ra, vui lòng thử lại.",
        TOAST_TYPES.ERROR
      );
    }
  };

  const exportExcelTrainingHistoryClick = async () => {
    try {
      showLoader();
      const res = await authorizedAxiosinstance.get(
        `${API_ROOT}dashboards/exportTrainingHistory`
      );

      if (res && res.data) {
        downloadFile(res.data.base64, true);
        showToast("Thông báo", "Xuất file thành công", TOAST_TYPES.SUCCESS);
        hideLoader();
      } else {
        showToast("Thông báo", "Không có dữ liệu", TOAST_TYPES.ERROR);
        hideLoader();
      }
    } catch (error) {
      hideLoader();
      showToast(
        "Thông báo",
        "Có lỗi xảy ra, vui lòng thử lại.",
        TOAST_TYPES.ERROR
      );
    }
  };

  const exportExcelClassTrainerClick = async () => {
    try {
      showLoader();
      const res = await authorizedAxiosinstance.get(
        `${API_ROOT}dashboards/exportExcel`,
        {
          params: {
            startDate: moment().startOf("month").format("YYYY-MM-DD"),
            endDate: moment().endOf("month").format("YYYY-MM-DD"),
          },
        }
      );

      if (res && res.data && res.data.base64) {
        downloadFile(res.data.base64, false);
        showToast("Thông báo", "Xuất file thành công", TOAST_TYPES.SUCCESS);
        hideLoader();
      } else {
        showToast("Thông báo", "Không có dữ liệu", TOAST_TYPES.ERROR);
        hideLoader();
      }
    } catch (error) {
      hideLoader();
      showToast(
        "Thông báo",
        "Có lỗi xảy ra, vui lòng thử lại.",
        TOAST_TYPES.ERROR
      );
    }
  };

  const fetchDataUsers = async () => {
    try {
      const res = await authorizedAxiosinstance.get(
        `${API_ROOT}users/getAllUser`,
        {
          params: {
            page: 1,
            limit: 10000,
          },
        }
      );

      if (res && res.data && res.data.users.length > 0) {
        setTotalUsers(res.data.users);

        setTotalTrainer(
          res.data.users.filter((user) => user.role === "Trainer").length
        );

        setTotalStudent(
          res.data.users.filter((user) => user.role === "Student").length
        );
      }
    } catch (error) {
      showToast(
        "Thông báo",
        "Có lỗi xảy ra, vui lòng thử lại.",
        TOAST_TYPES.ERROR
      );
    }
  };

  return (
    <>
    {userRole === "Admin" ? (
      <Row className="dashboard">
        <Col sm="6" lg="6" xl="7" xxl="8">
          <Card>
            <CardBody>
              <Row>
                <Col md={3}>
                  <FormGroup>
                    <Label for="startDate">Chọn tháng</Label>
                    <Input
                      className="date-time"
                      type="month"
                      name="startDate"
                      id="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="desc-total">
                {userRole === "Admin" && (
                  <div className="button-month">
                    <Button
                      color="primary"
                      className="mt-2 btn"
                      onClick={exportExcelTrainingHistoryClick}
                    >
                      <i
                        className="bi bi-folder-check"
                        style={{ paddingRight: "7px" }}
                      ></i>
                      Xuất file lịch sử tập luyện
                    </Button>
                    <Button
                      color="primary"
                      className="mt-2 btn"
                      onClick={exportExcelClassTrainerClick}
                    >
                      <i
                        className="bi bi-folder-check"
                        style={{ paddingRight: "7px" }}
                      ></i>
                      Xuất file tổng lớp dạy của HLV trong tháng
                    </Button>
                  </div>
                )}

                <span className="title-month">
                  Lịch sử luyện tập trong tháng
                </span>
              </div>
              {/* <Button color="primary" className="mt-2 btn">
                Tháng
              </Button> */}
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
                  {trainingHistory &&
                    trainingHistory.length > 0 &&
                    trainingHistory.map((tData, index) => (
                      <tr key={index} className="border-top">
                        <td>
                          <div className="d-flex align-items-center p-2">
                            <img
                              src={tData.profile.avatar}
                              className="rounded-circle"
                              alt="avatar"
                              width="45"
                              height="45"
                            />
                          </div>
                        </td>
                        <td>
                          <strong>{tData.profile.name}</strong>
                        </td>
                        <td>
                          <strong>{tData.totalClasses} buổi</strong>
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
                  {userRole === "Admin" && (
                    <Button
                      color="primary"
                      className="mt-2 btn"
                      onClick={handleExport}
                    >
                      <i
                        className="bi bi-folder-check"
                        style={{ paddingRight: "7px" }}
                      ></i>
                      Xuất file theo chi nhánh
                    </Button>
                  )}
                </div>
                <div style={{ padding: "10px" }}>
                  <span style={{ padding: "5px" }}>
                    Cập nhật lúc: {currentDate.toLocaleTimeString()}{" "}
                    {currentDate.toLocaleDateString()}
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
                      <span>PT</span>
                    </div>
                  </Col>
                  <Col md={3} className="num">
                    <span>{totalTrainer}</span>
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
                    <span>{totalStudent}</span>
                  </Col>
                </Row>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      ) : (
        <Row className="dashboard">
        <h3>Xin chào! Đây là trang quản lý</h3>
      </Row>
      )}
      
    </>
  );
};

export default Dashboard;
