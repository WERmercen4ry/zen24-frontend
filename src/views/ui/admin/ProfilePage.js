import "../../../assets/scss/layout/profilePage.scss";
import React, { useState, useEffect, useContext } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  FormFeedback,
} from "reactstrap";
import classnames from "classnames";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";
import ChangePasswordModal from "./ChangePasswordModal";
import { useToast } from "../../../layouts/admin/ToastContext";
import { TOAST_TYPES } from "../../../utils/constant";
const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("1");
  const {showLoader, hideLoader } = useContext(LoaderContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    password: "",
    role: "",
    avatar: "",
    profile: {
      name: "",
      sex: "",
      weight: 0,
      height: 0,
      email: "",
      phone: "",
      address: "",
      date_of_birth: "", // Quyền thêm từ API
    },
  });
  const { showToast } = useToast();
  const [initialProfileData, setInitialProfileData] = useState({
    avatar: "",
    name: "",
    phone: "",
    email: "",
    role: "",
    sex: "",
    address: "",
  });

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    date_of_birth: "",
    sex: "",
  });

  const validate = () => {
    let isValid = true;
    let newErrors = {
      name: "",
      phone: "",
      email: "",
      date_of_birth: "",
      sex: "",
    };

    // Kiểm tra tên (không được để trống)
    if (!profileData.profile.name) {
      newErrors.name = "Họ tên không được để trống";
      isValid = false;
    }

    // Kiểm tra số điện thoại (phải là số và độ dài tối thiểu 10 ký tự)
    if (
      !profileData.profile.phone ||
      !/^\d{10,}$/.test(profileData.profile.phone)
    ) {
      newErrors.phone = "Số điện thoại phải là số và ít nhất 10 ký tự";
      isValid = false;
    }

    // Kiểm tra email (phải là email hợp lệ)
    if (
      !profileData.profile.email ||
      !/\S+@\S+\.\S+/.test(profileData.profile.email)
    ) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    // Kiểm tra ngày sinh (phải chọn ngày)
    if (!profileData.profile.date_of_birth) {
      newErrors.date_of_birth = "Vui lòng chọn ngày sinh";
      isValid = false;
    }

    // Kiểm tra giới tính (phải chọn giới tính)
    if (!profileData.profile.sex) {
      newErrors.sex = "Vui lòng chọn giới tính";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Get user infor API
  const fetchProfileData = async () => {
    showLoader();
    const userId = localStorage.getItem("userId");
    try {
      const res = await authorizedAxiosinstance.get(
        `${API_ROOT}users/getUserById?userId=${userId}`
      );
      const userProfile = res.data;
      setProfileData({
        avatar: userProfile.avatar || "",
        profile: {
          name: userProfile.profile.name || "",
          email: userProfile.profile.email || "",
          phone: userProfile.profile.phone || "",
          date_of_birth: userProfile.profile.date_of_birth
            ? new Date(userProfile.profile.date_of_birth)
                .toISOString()
                .split("T")[0]
            : "",
          sex: userProfile.profile.sex,
          address: userProfile.profile.address || "",
        },
        role: userProfile.role || "",
      });
      setInitialProfileData({
        avatar: userProfile.avatar,
        name: userProfile.profile.name,
        phone: userProfile.profile.phone,
        email: userProfile.profile.email,
        role: userProfile.role,
        sex:
          userProfile.profile.sex === "male"
            ? "Nam"
            : userProfile.profile.sex === "female"
            ? "Nữ"
            : "Khác",
        address: userProfile.profile.address,
      });
      hideLoader();
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  // Update user call API
  const updateUser = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return; // Nếu validate không thành công, dừng việc submit
    }
    showLoader();
    const userId = localStorage.getItem("userId");
    try {
      const res = await authorizedAxiosinstance.put(
        `${API_ROOT}users/updateUser?userId=${userId}`,
        profileData
      );
      showToast('Thông báo', 'Cập nhập thành công', TOAST_TYPES.SUCCESS); 
      fetchProfileData();
    } catch (error) {
      hideLoader();
      showToast('Thông báo', error, TOAST_TYPES.ERROR);
    }
  };

  // init data
  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      profile: {
        ...profileData.profile,
        [name]: value,
      },
    });
  };

  const groupsData = [
    {
      id: "638f63b7ce76f68a5cdebeb3",
      name: "Lễ tân các chi nhánh",
      createdAt: "01:23:31 07/12/2022",
      action: "Chỉnh sửa",
    },
  ];

  return (
    <div>
      <ChangePasswordModal isOpen={isModalOpen} toggle={toggleModal} />
      <div className="profile-page-container mb-3 pb-0">
        <div className="overview-section">
          <Row className="align-items-center">
            <Col md={2} className="text-center">
              <img
                src={
                  initialProfileData.avatar || "https://via.placeholder.com/150"
                }
                alt="Avatar"
                className="profile-avatar"
              />
            </Col>
            <Col md={10} className="profile-info">
              <div className="mb-2 d-flex">
                <h5 className="my-auto">
                  {initialProfileData.name || "CN - Hà Đô"}
                </h5>
                <button className="link-branches my-auto ms-2">
                  LIÊN TẤN CÁC CHI NHÁNH
                </button>
              </div>
              <div className=" d-flex">
                <p className="infor-group my-auto">
                  <i className="bi bi-telephone"></i> {initialProfileData.phone}
                </p>
                <p className="infor-group my-auto">
                  <i className="bi bi-envelope"></i> {initialProfileData.email}
                </p>
                <p className="infor-group my-auto">
                  <i className="bi bi-geo-alt-fill"></i>
                  {initialProfileData.address}
                </p>
              </div>
              <div className="mt-3 d-flex">
                <div className="stats-box">
                  <div className=" d-flex">
                    <i className="bi bi-people-fill me-1"></i>
                    <h5>1</h5>
                  </div>
                  <p>Nhóm</p>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <Nav tabs className="mt-4">
          <NavItem>
            <NavLink
              className={
                classnames({ active: activeTab === "1" }) + " form-label"
              }
              onClick={() => {
                toggleTab("1");
              }}
            >
              Tổng quan
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={
                classnames({ active: activeTab === "2" }) + " form-label"
              }
              onClick={() => {
                toggleTab("2");
              }}
            >
              Cài đặt
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={
                classnames({ active: activeTab === "3" }) + " form-label"
              }
              onClick={() => {
                toggleTab("3");
              }}
            >
              Các nhóm
            </NavLink>
          </NavItem>
        </Nav>
      </div>

      <TabContent activeTab={activeTab}>
        {/* Tab Tổng quan */}
        <TabPane tabId="1">
          <div className="profile-detail-container">
            <div className="profile-header">
              <h5 className="my-auto">Chi tiết hồ sơ</h5>
              <Button
                color="primary me-0"
                className="m-auto"
                onClick={() => {
                  toggleTab("2");
                }}
              >
                Chỉnh sửa hồ sơ
              </Button>
            </div>
            <div className="border-top profile-overview mt-2 px-4 py-2">
              <div className="d-flex">
                <span className="label form-label">Họ tên:</span>
                <p>{initialProfileData.name}</p>
              </div>
              <div className="d-flex">
                <span className="label form-label">Số điện thoại:</span>
                <p>{initialProfileData.phone}</p>
              </div>
              <div className="d-flex">
                <span className="label form-label">Email:</span>
                <p>{initialProfileData.email}</p>
              </div>
              <div className="d-flex">
                <span className="label form-label">Quyền:</span>
                <p>{initialProfileData.role}</p>
              </div>{" "}
              {/* Quyền thêm từ API */}
              <div className="d-flex">
                <span className="label form-label">Giới tính:</span>
                <p>{initialProfileData.sex}</p>
              </div>
              <div className="d-flex">
                <span className="label form-label">Địa chỉ:</span>
                <p>{initialProfileData.address}</p>
              </div>{" "}
              {/* Địa chỉ thêm từ API */}
              <div className="d-flex">
                <span className="label form-label">Liên lạc:</span>
                <p>Email, Phone</p>
              </div>
            </div>
          </div>
        </TabPane>

        {/* Tab Cài đặt */}
        <TabPane tabId="2">
          <div className="profile-detail-container">
            <div className="profile-header">
              <h5 className="my-auto">Chi tiết hồ sơ</h5>
            </div>
            <Form
              onSubmit={updateUser}
              className="border-top profile-overview mt-2 px-4 py-2"
            >
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
                    <img
                      src={
                        profileData.avatar || "https://via.placeholder.com/150"
                      }
                      alt="Avatar"
                      className="avatar-image"
                    />
                  </label>
                </div>
              </FormGroup>
              <FormGroup className="profile-detail-edit">
                <Label className="my-auto" for="name">
                  Họ tên *
                </Label>
                <div className="w-100">
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={profileData.profile.name || ""}
                    onChange={handleInputChange}
                    invalid={!!errors.name} // Đánh dấu input là invalid nếu có lỗi
                  />
                  <FormFeedback>{errors.name}</FormFeedback>
                  {/* Hiển thị lỗi */}
                </div>
              </FormGroup>

              <FormGroup className="profile-detail-edit">
                <Label className="my-auto" for="phone">
                  Số điện thoại *
                </Label>
                <div className="w-100">
                  <Input
                    type="text"
                    name="phone"
                    id="phone"
                    value={profileData.profile.phone || ""}
                    onChange={handleInputChange}
                    invalid={!!errors.phone} // Đánh dấu input là invalid nếu có lỗi
                  />
                  <FormFeedback>{errors.phone}</FormFeedback>
                  {/* Hiển thị lỗi */}
                </div>
              </FormGroup>

              <FormGroup className="profile-detail-edit">
                <Label className="my-auto" for="email">
                  Email *
                </Label>
                <div className="w-100">
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={profileData.profile.email || ""}
                    onChange={handleInputChange}
                    invalid={!!errors.email} // Đánh dấu input là invalid nếu có lỗi
                  />
                  <FormFeedback>{errors.email}</FormFeedback>
                  {/* Hiển thị lỗi */}
                </div>
              </FormGroup>

              <FormGroup className="profile-detail-edit">
                <Label className="my-auto" for="birthDate">
                  Ngày sinh
                </Label>
                <div className="w-100">
                  <Input
                    type="date"
                    name="date_of_birth"
                    id="birthDate"
                    value={profileData.profile.date_of_birth || ""}
                    onChange={handleInputChange}
                    invalid={!!errors.date_of_birth} // Đánh dấu input là invalid nếu có lỗi
                  />
                  <FormFeedback>{errors.date_of_birth}</FormFeedback>
                </div>
              </FormGroup>

              <FormGroup tag="fieldset" className="profile-detail-edit">
                <Label className="my-auto">Giới tính *</Label>
                <div className="w-100">
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        type="radio"
                        name="sex"
                        value="male"
                        checked={profileData.profile.sex === "male"}
                        onChange={handleInputChange}
                        invalid={!!errors.sex} // Đánh dấu input là invalid nếu có lỗi
                      />{" "}
                      Nam
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        type="radio"
                        name="sex"
                        value="female"
                        checked={profileData.profile.sex === "female"}
                        onChange={handleInputChange}
                        invalid={!!errors.sex} // Đánh dấu input là invalid nếu có lỗi
                      />{" "}
                      Nữ
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        type="radio"
                        name="sex"
                        value="other"
                        checked={profileData.profile.sex === "other"}
                        onChange={handleInputChange}
                        invalid={!!errors.sex} // Đánh dấu input là invalid nếu có lỗi
                      />{" "}
                      Khác
                    </Label>
                  </FormGroup>
                  <FormFeedback>{errors.sex}</FormFeedback>
                </div>{" "}
                {/* Hiển thị lỗi */}
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
              <div className="d-flex py-1 my-auto">
                <span className="label form-label">Địa chỉ email:</span>
                <p className="my-auto">{profileData.profile.email}</p>
              </div>
              <div className="d-flex py-1 my-auto">
                <span className="label form-label">Mật khẩu:</span>
                <div className="d-flex w-100 justify-content-between">
                  <p className="my-auto">**********</p>{" "}
                  <Button className="btn" color="primary" size="sm" onClick={toggleModal}>
                    Cập nhập mật khẩu
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabPane>

        {/* Tab Các nhóm */}
        <TabPane tabId="3">
          <div className="profile-detail-container">
            <div className="profile-header">
              <h5 className="my-auto">Nhóm</h5>
            </div>
            <div className="px-4">
              <Table>
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
                      <td>
                        <Button color="secondary m-auto" size="sm">
                          Edit
                        </Button>{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default ProfilePage;