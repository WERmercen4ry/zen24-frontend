import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  FormFeedback,
} from "reactstrap";
import "../../../assets/scss/layout/user.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";
import { useToast } from "../../../layouts/admin/ToastContext";
import { TOAST_TYPES } from "../../../utils/constant";
import { uploadFileToFirebase } from "../../../utils/firebaseConfig";
import axios from "axios";

const UserForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { showToast } = useToast();
  const [agencyList, setAgencyList] = useState([]);
  const [formData, setFormData] = useState({
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
      goals: "", // Thêm trường mục tiêu
      Province: "",
      District: "",
      Commune: "",
    },
    agency: [],
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { userUpdateId } = location.state || {};
  const [errors, setErrors] = useState({});

  const [cities, setCities] = useState([]); // Danh sách tỉnh
  const [Districts, setDistricts] = useState([]); // Danh sách quận/huyện
  const [Communes, setWards] = useState([]); // Danh sách xã/phường
  const isEdit = !!userUpdateId;
  // Lấy danh sách tỉnh
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
    if (isEdit) {
      fetchProfileData();
    }
  }, []);
  // Get user infor API
  const fetchProfileData = async () => {
    showLoader();
    try {
      const res = await authorizedAxiosinstance.get(
        `${API_ROOT}users/getUserById?userId=${userUpdateId}`
      );
      const userProfile = res.data;
      setFormData({
        avatar: userProfile.avatar || "",
        username: userProfile.username,
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
          goals: userProfile.profile.goals || "",
          weight: userProfile.profile.weight || "",
          height: userProfile.profile.height || "",
          Province: userProfile.profile.Province || "",
          District: userProfile.profile.District || "",
          Commune: userProfile.profile.Commune || "",
        },
        role: userProfile.role || "",
        agency: [userProfile.agency.length > 0 && userProfile.agency[0]._id],
      });
      if (userProfile.profile.District) {
        await axios
          .get(
            `https://esgoo.net/api-tinhthanh/3/${userProfile.profile.District}.htm`
          )
          .then((res) => {
            setWards(res.data.data);
          })
          .catch((error) => {
            console.error("Lỗi khi lấy danh sách xã/phường:", error);
          });
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
    hideLoader();
  };
  // Lấy danh sách quận/huyện khi tỉnh được chọn
  useEffect(() => {
    if (formData.profile.Province) {
      axios
        .get(
          `https://esgoo.net/api-tinhthanh/2/${formData.profile.Province}.htm`
        )
        .then((res) => {
          setDistricts(res.data.data);
          setWards([]); // Reset danh sách xã/phường khi chọn tỉnh khác
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách quận/huyện:", error);
        });
    }
  }, [formData.profile.Province]);

  // Lấy danh sách xã/phường khi quận/huyện được chọn
  useEffect(() => {
    if (formData.profile.District) {
      axios
        .get(
          `https://esgoo.net/api-tinhthanh/3/${formData.profile.District}.htm`
        )
        .then((res) => {
          setWards(res.data.data);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách xã/phường:", error);
        });
    }
  }, [formData.profile.District]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file); // Lưu file đã chọn vào state

    // Tạo URL để preview hình ảnh
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result); // Set URL của ảnh để hiển thị trước
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "agency") {
      setFormData({
        ...formData,
        agency: [value], // Cập nhật giá trị chi nhánh (agency) vào formData
      });
    } else if (
      [
        "name",
        "sex",
        "weight",
        "height",
        "email",
        "phone",
        "address",
        "date_of_birth",
        "goals",
        "Commune",
        "District",
        "Province",
      ].includes(name)
    ) {
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          [name]: value,
        },
      });
    } else {
      // Cập nhật các trường khác ngoài profile
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validate = () => {
    let newErrors = {};
    // Username validation
    if (!formData.username) newErrors.username = "Vui lòng nhập tên người dùng";

    // Password validation
    if (!isEdit) {
      if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
    }

    // Role validation
    if (!formData.role) newErrors.role = "Vui lòng chọn vai trò";

    // Name validation
    if (!formData.profile.name) newErrors.name = "Vui lòng nhập họ tên";

    // Phone number validation
    if (!formData.profile.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^\d{10,}$/.test(formData.profile.phone)) {
      newErrors.phone = "Số điện thoại phải gồm ít nhất 10 chữ số";
    }

    // Email validation
    if (!formData.profile.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.profile.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Address validation
    if (!formData.profile.Province)
      newErrors.Province = "Vui lòng chọn thành phố";

    if (!formData.agency[0]) newErrors.agency = "Vui lòng chọn thành phố";
    if (!formData.profile.District)
      newErrors.District = "Vui lòng chọn quận/huyện";
    if (!formData.profile.Commune)
      newErrors.Commune = "Vui lòng chọn xã/phường";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const fetchLocation = () => {
    authorizedAxiosinstance
      .get(`${API_ROOT}/dashboards/getListLocations`)
      .then((res) => {
        if (res.response?.status === 403 || res.response?.status === 500) {
          showToast("Thông báo", res.data?.message, TOAST_TYPES.ERROR);
        } else {
          setAgencyList(res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
      });
  };

  const getCityById = (id) => {
    return cities.find((Province) => Province.id === id);
  };
  const getDistrictById = (id) => {
    return Districts.find((District) => District.id === id);
  };
  const getWardById = (id) => {
    return Communes.find((Commune) => Commune.id === id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    showLoader();
    try {
      let avatarUrl = formData.avatar;
      if (selectedFile) {
        avatarUrl = await uploadFileToFirebase(selectedFile); // Upload file và lấy URL
      }
      const Province = getCityById(formData.profile.Province);
      const District = getDistrictById(formData.profile.District);
      const Commune = getWardById(formData.profile.Commune);
      const fullAddress =
        Province.full_name +
        ", " +
        District.full_name +
        ", " +
        Commune.full_name;
      console.log(fullAddress);
      const updatedFormData = {
        ...formData,
        profile: {
          ...formData.profile,
          address: fullAddress,
        },
        avatar: avatarUrl,
      };
      var res;
      if (isEdit) {
        // Chỉnh sửa người dùng
        res = await authorizedAxiosinstance.put(
          `${API_ROOT}users/updateUser?userId=${userUpdateId}`,
          updatedFormData
        );
      } else {
        // Thêm mới người dùng
        res = await authorizedAxiosinstance.post(
          `${API_ROOT}users/createUser`,
          updatedFormData
        );
      }
      hideLoader();
      if (res.response?.status === 403 || res.response?.status === 500) {
        showToast("Thông báo", res.response?.data?.message, TOAST_TYPES.ERROR);
      } else {
        if (isEdit) {
          showToast(
            "Thông báo",
            "Chỉnh sửa người dùng thành công",
            TOAST_TYPES.SUCCESS
          );
          fetchProfileData();
        } else {
          showToast(
            "Thông báo",
            "Tạo mới người dùng thành công",
            TOAST_TYPES.SUCCESS
          );
          navigate("/admin/customers-manager");
        }
      }
    } catch (error) {

      showToast("Thông báo", error, TOAST_TYPES.ERROR);
    }
    hideLoader();
  };

  useEffect(() => {
    fetchLocation();
  }, []);
  return (
    <div className="user-form-container">
      <div className="timetable-header">
        <h3>{isEdit ? "Chỉnh sửa người dùng" : " Thêm mới người dùng"}</h3>
        <Link to={"/admin/customers-manager"}>
          <Button className="btn mx-auto my-auto" outline color="secondary">
            ← Trở về
          </Button>
        </Link>
      </div>
      <Form onSubmit={handleSubmit}>
        <Row form="true">
          <Col md={3} className="text-center">
            <FormGroup>
              <Label for="avatar">Avatar *</Label>
              <div className="avatar-upload">
                <Input
                  type="file"
                  id="avatar"
                  name="avatar"
                  className="d-none"
                  onChange={handleFileChange} // Gán hàm xử lý khi chọn file
                  invalid={!!errors.avatar}
                />
                <label className="avatar-placeholder" htmlFor="avatar">
                  <img
                    src={
                      previewImage ||
                      formData.avatar ||
                      "https://via.placeholder.com/150"
                    }
                    alt="Avatar"
                    className="avatar-image"
                  />
                </label>
                {errors.avatar && <FormFeedback>{errors.avatar}</FormFeedback>}
              </div>
            </FormGroup>
          </Col>
          <Col md={9}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="username">
                    Tên đăng nhập <span className="require-input">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    invalid={!!errors.username}
                  />
                  {errors.username && (
                    <FormFeedback>{errors.username}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="password">
                    Mật khẩu <span className="require-input">*</span>
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password || isEdit ? "********" : ""}
                    onChange={handleInputChange}
                    invalid={!!errors.password}
                    disabled={isEdit}
                  />
                  {errors.password && (
                    <FormFeedback>{errors.password}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>
                    Loại Tài Khoản <span className="require-input">*</span>
                  </Label>
                  <div>
                    <Label check className="pe-2">
                      <Input
                        type="radio"
                        name="role"
                        value="Trainer"
                        checked={formData.role === "Trainer"}
                        onChange={handleInputChange}
                        invalid={!!errors.role}
                      />
                      Trainer
                    </Label>
                    <Label check className="ml-4 pe-2">
                      <Input
                        type="radio"
                        name="role"
                        value="Student"
                        checked={formData.role === "Student"}
                        onChange={handleInputChange}
                        invalid={!!errors.role}
                      />
                      Student
                    </Label>
                  </div>
                  {errors.role && <FormFeedback>{errors.role}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="agency">
                    Chi Nhánh <span className="require-input">*</span>
                  </Label>
                  <Input
                    type="select"
                    name="agency"
                    id="agency"
                    value={formData.agency[0] || ""}
                    onChange={handleInputChange}
                    invalid={!!errors.agency}
                  >
                    <option value="">Chọn chi nhánh</option>
                    {agencyList.map((Location) => (
                      <option key={Location._id} value={Location._id}>
                        {Location.name}
                      </option>
                    ))}
                  </Input>
                  {errors.agency && (
                    <FormFeedback>{errors.agency}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">
                    Họ Tên <span className="require-input">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.profile.name}
                    onChange={handleInputChange}
                    invalid={!!errors.name}
                  />
                  {errors.name && <FormFeedback>{errors.name}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="date_of_birth">Ngày Sinh</Label>
                  <Input
                    type="date"
                    name="date_of_birth"
                    id="date_of_birth"
                    value={formData.profile.date_of_birth}
                    onChange={handleInputChange}
                    invalid={!!errors.date_of_birth}
                  />
                  {errors.date_of_birth && (
                    <FormFeedback>{errors.date_of_birth}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="phone">
                    Số Điện Thoại <span className="require-input">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData.profile.phone}
                    onChange={handleInputChange}
                    invalid={!!errors.phone}
                  />
                  {errors.phone && <FormFeedback>{errors.phone}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="email">
                    Email <span className="require-input">*</span>
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.profile.email}
                    onChange={handleInputChange}
                    invalid={!!errors.email}
                  />
                  {errors.email && <FormFeedback>{errors.email}</FormFeedback>}
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
                    value={formData.profile.goals}
                    onChange={handleInputChange}
                    invalid={!!errors.goals}
                  />
                  {errors.goals && <FormFeedback>{errors.goals}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>
                    Giới Tính <span className="require-input">*</span>
                  </Label>
                  <div>
                    <Label check className="pe-2">
                      <Input
                        type="radio"
                        name="sex"
                        value="male"
                        checked={formData.profile.sex === "male"}
                        onChange={handleInputChange}
                        invalid={!!errors.sex}
                      />{" "}
                      Nam
                    </Label>
                    <Label check className="ml-4 pe-2">
                      <Input
                        type="radio"
                        name="sex"
                        value="female"
                        checked={formData.profile.sex === "female"}
                        onChange={handleInputChange}
                        invalid={!!errors.sex}
                      />{" "}
                      Nữ
                    </Label>
                    <Label check className="ml-4 pe-2">
                      <Input
                        type="radio"
                        name="sex"
                        value="orther"
                        checked={formData.profile.sex === "orther"}
                        onChange={handleInputChange}
                        invalid={!!errors.sex}
                      />{" "}
                      Khác
                    </Label>
                  </div>
                  {errors.sex && <FormFeedback>{errors.sex}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label for="weight">Cân nặng (Kg)</Label>
                  <Input
                    type="number"
                    name="weight"
                    id="weight"
                    value={formData.profile.weight}
                    onChange={handleInputChange}
                    invalid={!!errors.weight}
                  />
                  {errors.weight && (
                    <FormFeedback>{errors.weight}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="height">Chiều Cao (cm)</Label>
                  <Input
                    type="number"
                    name="height"
                    id="height"
                    value={formData.profile.height}
                    onChange={handleInputChange}
                    invalid={!!errors.height}
                  />
                  {errors.height && (
                    <FormFeedback>{errors.height}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>

        <h4>Chọn Tỉnh Thành</h4>
        <Row>
          <Col md={4}>
            <FormGroup>
              <Label for="Province">
                Thành Phố <span className="require-input">*</span>
              </Label>
              <Input
                type="select"
                name="Province"
                id="Province"
                value={formData.profile.Province}
                onChange={handleInputChange}
                invalid={!!errors.Province}
              >
                <option value="">Chọn thành phố</option>
                {cities.map((Province) => (
                  <option key={Province.id} value={Province.id}>
                    {Province.full_name}
                  </option>
                ))}
              </Input>
              {errors.Province && (
                <FormFeedback>{errors.Province}</FormFeedback>
              )}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="District">
                Quận, Huyện <span className="require-input">*</span>
              </Label>
              <Input
                type="select"
                name="District"
                id="District"
                value={formData.profile.District}
                onChange={handleInputChange}
                invalid={!!errors.District}
              >
                <option value="">Chọn quận, huyện</option>
                {Districts.map((District) => (
                  <option key={District.id} value={District.id}>
                    {District.full_name}
                  </option>
                ))}
              </Input>
              {errors.District && (
                <FormFeedback>{errors.District}</FormFeedback>
              )}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="Commune">
                Xã, Phường <span className="require-input">*</span>
              </Label>
              <Input
                type="select"
                name="Commune"
                id="Commune"
                value={formData.profile.Commune}
                onChange={handleInputChange}
                invalid={!!errors.Commune}
              >
                <option value="">Chọn xã, phường</option>
                {Communes.map((Commune) => (
                  <option key={Commune.id} value={Commune.id}>
                    {Commune.full_name}
                  </option>
                ))}
              </Input>
              {errors.Commune && <FormFeedback>{errors.Commune}</FormFeedback>}
            </FormGroup>
          </Col>
        </Row>
        <div className="btn-form">
          <Button color="primary" type="submit">
            {isEdit ? "Chỉnh sửa" : " Thêm mới"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UserForm;
