import {
  Container,
  Row,
  Col,
  Button,
  FormFeedback,
  Input,
  FormGroup,
  Label,
  Form,
} from "reactstrap";
import React, { useState, useEffect, useContext } from "react";
import "../../../assets/scss/layout/update_user.scss";
import axios from "axios";
import { API_ROOT } from "../../../utils/constant";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";
import { uploadFileToFirebase } from "../../../utils/firebaseConfig";
import ConfirmPopup from "../../../layouts/user/ConfirmPopup";

const UpdateUser = () => {
  const [formData, setFormData] = useState({
    avatar: "",
    name: "",
    birthDate: "",
    gender: "",
    cityName: "",
    districtName: "",
    communeName: "",
    weight: 0,
    height: 0,
    targetTrain: "",
  });

  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]); // Danh sách tỉnh
  const [districts, setDistricts] = useState([]); // Danh sách quận/huyện
  const [communes, setWards] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const { showLoader, hideLoader } = useContext(LoaderContext);

  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(true);
  const [formPopupConfirm, setFormPopupConfirm] = useState({
    message: "",
    title: "",
  });

  useEffect(() => {
    axios
      .get(`https://esgoo.net/api-tinhthanh/1/0.htm`)
      .then((res) => {
        setCities(res.data.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách tỉnh:", error);
      });

    const userInfoGet = localStorage.getItem("userId");
    if (userInfoGet) {
      fetchDataUser(userInfoGet);
    }
  }, []);

  const fetchDataUser = (userId) => {
    authorizedAxiosinstance
      .get(`${API_ROOT}users/getUserById?userId=${userId}`)
      .then((res) => {
        if (res && res.data && res.data.profile)
          setFormData({
            avatar: res.data.avatar,
            name: res.data.profile.name,
            birthDate:
              res.data.profile.date_of_birth !== ""
                ? res.data.profile.date_of_birth.split("T")[0]
                : "",
            gender: res.data.profile.sex,
            cityName: res.data.profile.Province,
            districtName: res.data.profile.District,
            communeName: res.data.profile.Commune,
            weight: res.data.profile.weight,
            height: res.data.profile.height,
            targetTrain: res.data.profile.training_goals,
          });
      })
      .catch((error) => {
        console.error("Error fetching users data:", error);
        throw error;
      });
  };

  useEffect(() => {
    if (formData.cityName) {
      axios
        .get(`https://esgoo.net/api-tinhthanh/2/${formData.cityName}.htm`)
        .then((res) => {
          setDistricts(res.data.data); // Reset danh sách xã/phường khi chọn tỉnh khác
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách quận/huyện:", error);
        });
    }
  }, [formData.cityName]);

  useEffect(() => {
    if (formData.districtName) {
      axios
        .get(`https://esgoo.net/api-tinhthanh/3/${formData.districtName}.htm`)
        .then((res) => {
          setWards(res.data.data);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách xã/phường:", error);
        });
    }
  }, [formData.districtName]);

  const validate = () => {
    let newErrors = {};

    if (!formData.birthDate) newErrors.birthDate = "Vui lòng nhập ngày sinh";

    if (!formData.gender) newErrors.gender = "Vui lòng chọn giới tính";

    if (!formData.cityName) newErrors.cityName = "Vui lòng chọn tính/thành phố";

    if (!formData.districtName)
      newErrors.districtName = "Vui lòng chọn quận/huyện";

    if (!formData.communeName)
      newErrors.communeName = "Vui lòng chọn phường/xã";

    if (!formData.weight) newErrors.weight = "Vui lòng chọn cân nặng";

    if (!formData.height) newErrors.height = "Vui lòng chọn chiều cao";

    if (!formData.targetTrain)
      newErrors.targetTrain = "Vui lòng chọn mục tiêu luyện tập";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        avatarUrl = await uploadFileToFirebase(selectedFile);
      }

      const Province = getCityById(formData.cityName);
      const District = getDistrictById(formData.districtName);
      const Commune = getWardById(formData.communeName);
      const fullAddress =
        Province.full_name +
        ", " +
        District.full_name +
        ", " +
        Commune.full_name;

      const updateUser = {
        avatar: avatarUrl,
        profile: {
          sex: formData.gender,
          weight: formData.weight,
          height: formData.height,
          Province: formData.cityName,
          District: formData.districtName,
          Commune: formData.communeName,
          address: fullAddress,
          date_of_birth: new Date(formData.birthDate),
          training_goals: formData.targetTrain,
        },
      };
      const userInfoGet = localStorage.getItem("userId");

      var res = await authorizedAxiosinstance.put(
        `${API_ROOT}users/updateUser?userId=${userInfoGet}`,
        updateUser
      );

      if (res?.status !== 200) {
        showNotification("Cập nhật người dùng thất bại");
      } else {
        showNotification("Cập nhật người dùng thành công");
        fetchDataUser(userInfoGet);
      }

      hideLoader();
    } catch (error) {
      showNotification("Cập nhật người dùng thất bại");
      hideLoader();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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

  const getCityById = (id) => {
    return cities.find((Province) => Province.id === id);
  };
  const getDistrictById = (id) => {
    return districts.find((District) => District.id === id);
  };
  const getWardById = (id) => {
    return communes.find((Commune) => Commune.id === id);
  };

  const showNotification = (message) => {
    setIsConfirm(false);
    setFormPopupConfirm({
      ...formPopupConfirm,
      message: message,
      title: "Thông báo",
    });
    toggle();
  };

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Container className="workout-history mt-2 card-content">
      <ConfirmPopup
        isOpen={isOpen}
        toggle={toggle}
        isConfirm={isConfirm}
        title={formPopupConfirm.title}
        message={formPopupConfirm.message}
      />
      <Form onSubmit={handleSubmit}>
        <Row form="true">
          <Col
            md={12}
            className="text-center"
            style={{ flexDirection: "column" }}
          >
            <FormGroup>
              <Label className="avatar-label" for="avatar">
                Ảnh đại diện*
              </Label>
              <div className="avatar-upload">
                <Input
                  type="file"
                  id="avatar"
                  name="avatar"
                  onChange={handleFileChange}
                  invalid={!!errors.avatar}
                  className="d-none"
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
                    style={{
                      borderRadius: "50%",
                      width: "150px",
                      height: "150px",
                    }}
                  />
                </label>
                {errors.avatar && <FormFeedback>{errors.avatar}</FormFeedback>}
              </div>
              <small className="form-text text-muted">
                Chọn ảnh ở định dạng *.png, *.jpg hoặc *.jpeg
              </small>
            </FormGroup>
            <strong>Thông tin cá nhân</strong>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="name">Họ và tên</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled
              />
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="birthDate">Ngày Sinh *</Label>
              <Input
                type="date"
                name="birthDate"
                id="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                invalid={!!errors.birthDate}
              />
              {errors.birthDate && (
                <FormFeedback>{errors.birthDate}</FormFeedback>
              )}
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="gender">Giới Tính *</Label>
              <Input
                type="select"
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleInputChange}
                invalid={!!errors.gender}
              >
                <option value="">Giới tính *</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </Input>
              {errors.gender && <FormFeedback>{errors.gender}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="cityName">Tỉnh/ Thành Phố *</Label>
              <Input
                type="select"
                name="cityName"
                id="cityName"
                value={formData.cityName}
                onChange={handleInputChange}
                invalid={!!errors.cityName}
              >
                <option value="">Tỉnh/ Thành Phố</option>
                {cities.map((Province) => (
                  <option key={Province.id} value={Province.id}>
                    {Province.full_name}
                  </option>
                ))}
              </Input>
              {errors.cityName && (
                <FormFeedback>{errors.cityName}</FormFeedback>
              )}
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="districtName">Quận/ Huyện *</Label>
              <Input
                type="select"
                name="districtName"
                id="districtName"
                value={formData.districtName}
                onChange={handleInputChange}
                invalid={!!errors.districtName}
              >
                <option value="">Quận/ Huyện</option>
                {districts.map((District) => (
                  <option key={District.id} value={District.id}>
                    {District.full_name}
                  </option>
                ))}
              </Input>
              {errors.districtName && (
                <FormFeedback>{errors.districtName}</FormFeedback>
              )}
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="communeName">Phường/ Xã *</Label>
              <Input
                type="select"
                name="communeName"
                id="communeName"
                value={formData.communeName}
                onChange={handleInputChange}
                invalid={!!errors.communeName}
              >
                <option value="">Phường/ Xã</option>
                {communes.map((Commune) => (
                  <option key={Commune.id} value={Commune.id}>
                    {Commune.full_name}
                  </option>
                ))}
              </Input>
              {errors.communeName && (
                <FormFeedback>{errors.communeName}</FormFeedback>
              )}
            </FormGroup>
          </Col>
          <Col md={12}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="weight">Cân Nặng *</Label>
                  <Input
                    type="text"
                    name="weight"
                    id="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="kg"
                    invalid={!!errors.weight}
                  />
                  {errors.weight && (
                    <FormFeedback>{errors.weight}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="height">Chiều Cao *</Label>
                  <Input
                    type="text"
                    name="height"
                    id="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="cm"
                    invalid={!!errors.height}
                  />
                  {errors.height && (
                    <FormFeedback>{errors.height}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="targetTrain">Mục Tiêu Luyện Tập *</Label>
              <Input
                type="textarea"
                name="targetTrain"
                id="targetTrain"
                value={formData?.targetTrain}
                onChange={handleInputChange}
                placeholder="Vd: Giảm cân, tăng vòng 3"
                invalid={!!errors.targetTrain}
              />
              {errors.targetTrain && (
                <FormFeedback>{errors.targetTrain}</FormFeedback>
              )}
            </FormGroup>
          </Col>
          <Col
            md={12}
            className="d-flex align-items-center justify-content-end"
          >
            <Button color="primary" type="submit" className="mb-4">
              Lưu
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default UpdateUser;
