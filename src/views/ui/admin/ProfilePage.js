import "../../../assets/scss/layout/profilePage.scss";
import uploadDefault from "../../../assets/images/users/upload_default.jpg";
import avatarDefault from "../../../assets/images/users/avatar_default.jpg";
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
  FormFeedback,
} from "reactstrap";
import classnames from "classnames";
import ChangePasswordModal from "./ChangePasswordModal";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";
import { useToast } from "../../../layouts/admin/ToastContext";
import { TOAST_TYPES } from "../../../utils/constant";
import { uploadFileToFirebase } from "../../../utils/firebaseConfig";
import axios from "axios";
const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(""); // State để giữ URL của ảnh preview
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cities, setCities] = useState([]); // Danh sách tỉnh
  const [districts, setdistricts] = useState([]); // Danh sách quận/huyện
  const [communes, setWards] = useState([]); // Danh sách xã/phường
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
      date_of_birth: "",
      province: "",
      district: "",
      commune: "",
    },
  });
  const validateImage = (file) => {
    const validFormats = ["image/jpeg", "image/png", "image/gif"];
    if (file && !validFormats.includes(file.type)) {
      return false;
    }
    return true;
  };
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
  });

  const validate = () => {
    let newErrors = {
    };

    // Kiểm tra tên (không được để trống)
    if (!profileData.profile.name) {
      newErrors.name = "Họ tên không được để trống";

    }

    // Kiểm tra số điện thoại (phải là số và độ dài tối thiểu 10 ký tự)
    if (
      !profileData.profile.phone ||
      !/^\d{10,}$/.test(profileData.profile.phone)
    ) {
      newErrors.phone = "Số điện thoại phải là số và ít nhất 10 ký tự";

    }

    // Kiểm tra email (phải là email hợp lệ)
    if (
      !profileData.profile.email ||
      !/\S+@\S+\.\S+/.test(profileData.profile.email)
    ) {
      newErrors.email = "Email không hợp lệ";

    }

    // Kiểm tra ngày sinh (phải chọn ngày)
    if (!profileData.profile.date_of_birth) {
      newErrors.date_of_birth = "Vui lòng chọn ngày sinh";

    }

    // Kiểm tra giới tính (phải chọn giới tính)
    if (!profileData.profile.sex) {
      newErrors.sex = "Vui lòng chọn giới tính";

    }
    if (!profileData.profile.province)
      newErrors.address = "Vui lòng chọn thành phố";

    if (!profileData.profile.district)
      newErrors.address = newErrors.address
        ? newErrors.address + ", quận/huyện"
        : "Vui lòng chọn quận/huyện";
    if (!profileData.profile.commune)
      newErrors.address = newErrors.address
        ? newErrors.address + ", xã/phường"
        : "Vui lòng chọn quận/huyện";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  useEffect(() => {
    axios
      .get(`https://esgoo.net/api-tinhthanh/1/0.htm`)
      .then((res) => {
        setCities(res.data.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách tỉnh:", error);
      });
  }, []);
  useEffect(() => {
    if (profileData.profile.province) {
      axios
        .get(
          `https://esgoo.net/api-tinhthanh/2/${profileData.profile.province}.htm`
        )
        .then((res) => {
          setdistricts(res.data.data);
          setWards([]); // Reset danh sách xã/phường khi chọn tỉnh khác
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách quận/huyện:", error);
        });
    }
  }, [profileData.profile.province]);

  // Lấy danh sách xã/phường khi quận/huyện được chọn
  useEffect(() => {
    if (profileData.profile.district) {
      axios
        .get(
          `https://esgoo.net/api-tinhthanh/3/${profileData.profile.district}.htm`
        )
        .then((res) => {
          setWards(res.data.data);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách xã/phường:", error);
        });
    }
  }, [profileData.profile.district]);
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
          province: userProfile.profile.province || "",
          district: userProfile.profile.district || "",
          commune: userProfile.profile.commune || "",
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
      if (userProfile.profile.district) {
        await axios
          .get(
            `https://esgoo.net/api-tinhthanh/3/${userProfile.profile.district}.htm`
          )
          .then((res) => {
            setWards(res.data.data);
          })
          .catch((error) => {
            console.error("Lỗi khi lấy danh sách xã/phường:", error);
          });
      }
      hideLoader();
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };
  const getCityById = (id) => {
    return cities.find((province) => province.id === id);
  };
  const getdistrictById = (id) => {
    return districts.find((district) => district.id === id);
  };
  const getWardById = (id) => {
    return communes.find((commune) => commune.id === id);
  };

  // Update user call API
  const updateUser = async (e) => {
    e.preventDefault();
    if (!validate()) {
      console.log("asdasd");
      
      return;
    }
    showLoader();

    try {
      const userId = localStorage.getItem("userId");
      let avatarUrl = profileData.avatar;
      if (selectedFile) {
        avatarUrl = await uploadFileToFirebase(selectedFile, userId); // Upload file và lấy URL
      }
      const province = getCityById(profileData.profile.province);
      const district = getdistrictById(profileData.profile.district);
      const commune = getWardById(profileData.profile.commune);
      const fullAddress =
        province.full_name +
        ", " +
        district.full_name +
        ", " +
        commune.full_name;
      const updatedFormData = {
        ...profileData,
        profile: {
          ...profileData.profile,
          address: fullAddress,
        },
        avatar: avatarUrl,
      };
      var res = await authorizedAxiosinstance.put(
        `${API_ROOT}users/updateUser?userId=${userId}`,
        updatedFormData
      );
      if (res?.status !== 201) {
        showToast("Thông báo", "Cập nhập thành công", TOAST_TYPES.SUCCESS);
      } else {
        showToast("Thông báo", res.response?.data?.message, TOAST_TYPES.ERROR);
      }
      fetchProfileData();
    } catch (error) {
      showToast("Thông báo", error, TOAST_TYPES.ERROR);
    }
    hideLoader();
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateImage(file)) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      showToast(
        "Thông báo",
        "Vui lòng chọn tệp hình ảnh có định dạng JPG, PNG hoặc GIF.",
        TOAST_TYPES.ERROR
      );
    }
  };

  return (
    <div>
      <ChangePasswordModal isOpen={isModalOpen} toggle={toggleModal} />
      <div className="profile-page-container mb-3 pb-0">
        <div className="overview-section">
          <Row className="">
            <Col md={2} className="text-center">
              <img
                src={initialProfileData.avatar || avatarDefault}
                alt="Avatar"
                className="profile-avatar"
              />
            </Col>
            <Col md={10} className="profile-info">
              <div className="mb-2 d-flex">
                <h5 className="my-auto">
                  {initialProfileData.name || "CN - Hà Đô"}
                </h5>
              </div>
              <div className="">
                <p className="infor-group mb-1">
                  <i className="bi bi-telephone"></i> {initialProfileData.phone}
                </p>
                <p className="infor-group mb-1">
                  <i className="bi bi-envelope"></i> {initialProfileData.email}
                </p>
                <p className="infor-group mb-1">
                  <i className="bi bi-geo-alt-fill"></i>
                  {initialProfileData.address}
                </p>
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
              <div className="d-flex">
                <span className="label form-label">Giới tính:</span>
                <p>{initialProfileData.sex}</p>
              </div>
              <div className="d-flex">
                <span className="label form-label">Địa chỉ:</span>
                <p>{initialProfileData.address}</p>
              </div>{" "}
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
                <Label for="avatar my-auto">
                  Avatar <span className="require-input">*</span>
                </Label>
                <div className="avatar-upload ms-0">
                  <Input
                    type="file"
                    id="avatar"
                    name="avatar"
                    className="d-none"
                    onChange={handleFileChange} // Gán hàm xử lý khi chọn file
                  />
                  <label className="avatar-placeholder" htmlFor="avatar">
                    <img
                      src={previewImage || profileData.avatar || uploadDefault}
                      alt="Avatar"
                      className="avatar-image"
                    />
                  </label>
                </div>
              </FormGroup>
              <FormGroup className="profile-detail-edit">
                <Label className="my-auto" for="name">
                  Họ tên <span className="require-input">*</span>
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
                  Số điện thoại <span className="require-input">*</span>
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
                  Email <span className="require-input">*</span>
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
                  Ngày sinh <span className="require-input">*</span>
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
                <Label className="my-auto">
                  Giới tính <span className="require-input">*</span>
                </Label>
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
              <FormGroup className="profile-detail-edit">
                <Label className="my-auto" for="address">
                  Địa chỉ <span className="require-input">*</span>
                </Label>
                <div className="w-100">
                  <div className="d-flex">
                    <Input
                      type="select"
                      name="province"
                      id="province"
                      className="me-1"
                      value={profileData.profile.province}
                      onChange={handleInputChange}
                      invalid={!!errors.address}
                    >
                      <option value="">Chọn thành phố</option>
                      {cities.map((province) => (
                        <option key={province.id} value={province.id}>
                          {province.full_name}
                        </option>
                      ))}
                    </Input>
                    <Input
                      type="select"
                      name="district"
                      id="district"
                      className="me-1"
                      value={profileData.profile.district}
                      onChange={handleInputChange}
                      invalid={!!errors.address}
                    >
                      <option value="">Chọn quận, huyện</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.full_name}
                        </option>
                      ))}
                    </Input>
                    <Input
                      type="select"
                      name="commune"
                      id="commune"
                      value={profileData.profile.commune}
                      onChange={handleInputChange}
                      invalid={!!errors.address}
                    >
                      <option value="">Chọn xã, phường</option>
                      {communes.map((commune) => (
                        <option key={commune.id} value={commune.id}>
                          {commune.full_name}
                        </option>
                      ))}
                    </Input>
                  </div>
                  {errors.address && (
                    <FormFeedback className="d-flex">{errors.address}</FormFeedback>
                  )}
                </div>
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
                  <Button
                    className="btn"
                    color="primary"
                    size="sm"
                    onClick={toggleModal}
                  >
                    Cập nhập mật khẩu
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default ProfilePage;
