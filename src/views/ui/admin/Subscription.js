import React, { useEffect, useState, useContext } from "react";
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
  FormFeedback,
} from "reactstrap";
import "../../../assets/scss/layout/subscription.scss";
import { Link, useLocation } from "react-router-dom";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";
import { useToast } from "../../../layouts/admin/ToastContext";
import { TOAST_TYPES } from "../../../utils/constant";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";

const Subscription = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [listPackages, setListPackages] = useState([]);
  const [listPackageData, setListPackageData] = useState([]);
  const [packageSelected, setPackageSelected] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const [errors, setErrors] = useState({});

  const location = useLocation();
  const { userId } = location.state || {};

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const { showToast } = useToast();

  useEffect(() => {
    fetchPackage();
    fetchPackageForUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dữ liệu mẫu cho form đăng ký
  const [formData, setFormData] = useState({
    package: "",
    startDate: "",
    endDate: "",
    amount: 0,
    sessions: 1,
    amountPerSession: 0,
    method: "",
  });

  const validate = () => {
    let newErrors = {};

    if (!formData.package) newErrors.package = "Vui lòng chọn gói";

    if (!formData.method)
      newErrors.method = "Vui lòng chọn phương thức thanh toán";

    if (!formData.startDate) newErrors.startDate = "Vui lòng chọn ngày bắt dầu";

    if (!formData.endDate) newErrors.endDate = "Vui lòng chọn ngày kết thúc";

    const formattedDate = new Date(formData.startDate);
    const currentDate = new Date();
    formattedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (formattedDate < currentDate) {
      newErrors.startDate = "Ngày bắt đầu không được nhỏ hơn ngày hiện tại";
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (end <= start) {
      newErrors.startDate = "Ngày kết thúc phải lớn hơn ngày bắt đầu";
      newErrors.endDate = "Ngày kết thúc phải lớn hơn ngày bắt đầu";
    } else if (differenceInDays < 30) {
      newErrors.startDate = "Ngày bắt đầu và kết thúc phải cách nhau 1 tháng";
      newErrors.endDate = "Ngày bắt đầu và kết thúc phải cách nhau 1 tháng";
    } else {
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchPackageForUser = () => {
    authorizedAxiosinstance
      .get(`${API_ROOT}users/getUserRegisteredPackages?userId=${userId}`)
      .then((res) => {
        setListPackages(res.data);
      })
      .catch((error) => {
        console.error("Error fetching package data in user:", error);
      });
  };

  const fetchPackage = () => {
    authorizedAxiosinstance
      .get(`${API_ROOT}dashboards/packages`)
      .then((res) => {
        setListPackageData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching package data:", error);
      });
  };

  // Dữ liệu mẫu cho bảng danh sách gói tập

  useEffect(() => {
    let amount;
    let sessions;
    let amountPerSession;

    if (packageSelected && packageSelected.length > 0 && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Tính sự chênh lệch thời gian bằng milliseconds
      const timeDifference = end - start;

      // Chuyển đổi sự chênh lệch thời gian sang số ngày
      const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

      // Chia cho 30 để lấy ra số tháng và chỉ tính khi đủ 30 ngày trở lên cho 1 tháng
      const fullMonths = Math.floor(dayDifference / 30);

      if (fullMonths > 0) {
        amount = fullMonths * packageSelected[0].price;
        sessions = fullMonths * packageSelected[0].duration_in_months;
        amountPerSession = amount / sessions;

        setFormData({
          ...formData,
          amount: amount,
          sessions: sessions,
          amountPerSession: amountPerSession,
        });
      } else {
        setFormData({
          ...formData,
          amount: 0,
          sessions: 0,
          amountPerSession: 0,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageSelected, startDate, endDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "package") {
      setPackageSelected(
        listPackageData.filter((Package) => Package._id === value)
      );
    }

    if (name === "startDate") {
      setStartDate(new Date(value));
    }

    if (name === "endDate") {
      setEndDate(new Date(value));
    }

    if (packageSelected && packageSelected.length > 0 && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Tính số năm và tháng giữa hai ngày
      const yearsDifference = end.getFullYear() - start.getFullYear();
      const monthsDifference = end.getMonth() - start.getMonth();

      // Tính tổng số tháng dựa trên sự chênh lệch giữa năm và tháng
      // eslint-disable-next-line no-unused-vars
      const totalMonths = yearsDifference * 12 + monthsDifference;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addPackageForUser = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    showLoader();
    try {
      const reqBody = {
        packageId: formData.package,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        price_perday: formData.amountPerSession,
        price: formData.amount,
        totalDays: formData.sessions,
        method: formData.method,
      };
      const res = await authorizedAxiosinstance.put(
        `${API_ROOT}users/registerPackageForUser?userId=${userId}`,
        reqBody
      );

      hideLoader();
      if (res?.status === 403 || res?.status === 500) {
        showToast("Thông báo", res.response?.data?.message, TOAST_TYPES.ERROR);
      }

      if (res?.status === 200) {
        setFormData({
          package: "",
          startDate: "",
          endDate: "",
          amount: 0,
          sessions: 1,
          amountPerSession: 0,
          method: "",
        });
        fetchPackageForUser();
        setActiveTab("2");
      }
    } catch (error) {
      hideLoader();
      showToast("Thông báo", error, TOAST_TYPES.ERROR);
    }
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("vi-VN").format(number);
  };

  return (
    <Row>
      <Col>
        <div className="timetable-content">
          <div>
            <div className="timetable-header">
              <h4>Đăng ký gói</h4>
              <Link to={"/admin/customers-manager"}>
                <Button className="btn m-auto" outline color="secondary">
                  ← Trở về
                </Button>
              </Link>
            </div>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={activeTab === "1" ? "active" : ""}
                  onClick={() => {
                    toggleTab("1");
                  }}
                >
                  Đăng ký gói tập
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "2" ? "active" : ""}
                  onClick={() => {
                    toggleTab("2");
                  }}
                >
                  Danh sách gói Tập
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Form className="">
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="package">Gói <span className="require-input">*</span></Label>
                        <Input
                          type="select"
                          name="package"
                          id="package"
                          value={formData.package}
                          onChange={handleInputChange}
                          invalid={!!errors.package}
                        >
                          <option value="" disabled>
                            Chọn gói
                          </option>
                          {listPackageData.map((Package) => (
                            <option key={Package._id} value={Package._id}>
                              {Package.name}
                            </option>
                          ))}
                        </Input>
                        {errors.package && (
                          <FormFeedback>{errors.package}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="method">Phương Thức Thanh Toán <span className="require-input">*</span></Label>
                        <Input
                          type="select"
                          name="method"
                          id="method"
                          value={formData.method}
                          onChange={handleInputChange}
                          invalid={!!errors.method}
                        >
                          <option value="" disabled>
                            Phương thức thanh toán
                          </option>
                          <option value="Tiền mặt">Tiền mặt</option>
                          <option value="Chuyển khoản">Chuyển khoản</option>
                        </Input>
                        {errors.method && (
                          <FormFeedback>{errors.method}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="startDate">Ngày Bắt Đầu <span className="require-input">*</span></Label>
                        <Input
                          type="date"
                          name="startDate"
                          id="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          invalid={!!errors.startDate}
                        />
                        {errors.startDate && (
                          <FormFeedback>{errors.startDate}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="endDate">Ngày Kết Thúc <span className="require-input">*</span></Label>
                        <Input
                          type="date"
                          name="endDate"
                          id="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          invalid={!!errors.endDate}
                        />
                        {errors.endDate && (
                          <FormFeedback>{errors.endDate}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="amount">Số Tiền</Label>
                        <Input
                          type="text"
                          name="amount"
                          id="amount"
                          value={formatNumber(formData.amount)}
                          onChange={handleInputChange}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="sessions">Số Buổi</Label>
                        <Input
                          type="number"
                          name="sessions"
                          id="sessions"
                          value={formData.sessions}
                          onChange={handleInputChange}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="amountPerSession">Số tiền/Buổi</Label>
                        <Input
                          type="text"
                          name="amountPerSession"
                          id="amountPerSession"
                          value={formatNumber(formData.amountPerSession)}
                          onChange={handleInputChange}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="btn-form">
                    <Button
                      color="primary"
                      className="mt-2 btn"
                      onClick={addPackageForUser}
                    >
                      Thêm mới
                    </Button>
                  </div>
                </Form>
              </TabPane>
              <TabPane tabId="2">
                <Table>
                  <thead>
                    <tr>
                      <th>Loại gói</th>
                      <th>Tổng Số Buổi</th>
                      <th>Còn Lại</th>
                      <th>Tên Gói</th>
                      <th>Số tiền</th>
                      <th>Ngày Bắt Đầu</th>
                      <th>Ngày Kết Thúc</th>
                      <th>Trạng Thái Gói</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listPackages &&
                      listPackages.length > 0 &&
                      listPackages.map((pkg, index) => (
                        <tr key={index}>
                          <td>{pkg.package_id.type}</td>
                          <td>{pkg.remaining_lessons}</td>
                          <td>{pkg.remaining_lessons}</td>
                          <td>{pkg.package_id.name}</td>
                          <td>{pkg.price}</td>
                          <td>
                            {pkg.start_date != null
                              ? pkg.start_date.split("T")[0]
                              : ""}
                          </td>
                          <td>
                            {pkg.end_date != null
                              ? pkg.end_date.split("T")[0]
                              : ""}
                          </td>
                          <td>
                            {pkg.status === "Suspended" && (
                              <span
                                style={{
                                  backgroundColor: "red",
                                  color: "white",
                                  padding: "5px",
                                  borderRadius: "20px",
                                }}
                              >
                                Đã bảo lưu
                              </span>
                            )}
                            {pkg.status === "Active" && (
                              <span
                                style={{
                                  backgroundColor: "green",
                                  color: "white",
                                  padding: "5px",
                                  borderRadius: "20px",
                                }}
                              >
                                Đang hoạt động
                              </span>
                            )}
                            {pkg.status === "Expired" && (
                              <span
                                style={{
                                  backgroundColor: "gray",
                                  color: "white",
                                  padding: "5px",
                                  borderRadius: "20px",
                                }}
                              >
                                Hết hạn
                              </span>
                            )}
                          </td>
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
