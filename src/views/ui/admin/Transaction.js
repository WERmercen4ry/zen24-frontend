import React, { useState, useEffect, useContext } from "react";
import uploadDefault from "../../../assets/images/users/upload_default.jpg";
import moment from "moment";
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
import Select from "react-select";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";
import { useToast } from "../../../layouts/admin/ToastContext";
import { TOAST_TYPES } from "../../../utils/constant";
import { uploadFileToFirebase } from "../../../utils/firebaseConfig";
import "../../../assets/scss/layout/user.scss";
const Transaction = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const { userTransactionId } = location.state || {};
  const [errors, setErrors] = useState({});
  const [listStudentData, setListStudentData] = useState([]);
  const isEdit = !!userTransactionId;
  const [isChangeStatus, setIsChangeStatus] = useState(false);
  useEffect(() => {
    if (isEdit) {
      fetchProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchStudent = () => {
    authorizedAxiosinstance
      .get(`${API_ROOT}users/getUsersByRole`, {
        params: {
          role: "Student",
        },
      })
      .then((res) => {
        if (res.status !== 200) {
          showToast(
            "Thông báo",
            res.response?.data?.message,
            TOAST_TYPES.ERROR
          );
        } else {
          const studentOptions = res.data.map((student) => ({
            value: student.id,
            label: student.profile.name + " (" + student.username + ")",
          }));
          setListStudentData(studentOptions);
        }
      })
      .catch((error) => {
        console.error("Error fetching trainer data:", error);
      });
  };
  useEffect(() => {
    fetchStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const validateImage = (file) => {
    const validFormats = ["image/jpeg", "image/png", "image/gif"];
    if (file && !validFormats.includes(file.type)) {
      return false;
    }
    return true;
  };
  // Get user infor API
  const fetchProfileData = async () => {
    showLoader();
    try {
      const res = await authorizedAxiosinstance.get(
        `${API_ROOT}dashboards/getPaymentByID?paymentId=${userTransactionId}`
      );
      if (res.status !== 200) {
        showToast("Thông báo", res.response?.data?.message, TOAST_TYPES.ERROR);
      } else {
        const userProfile = res.data;
        setFormData(userProfile);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
    hideLoader();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setIsChangeStatus(true)
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.student_id) newErrors.student_id = "Vui lòng chọn học viên";
    if (!selectedFile && !formData.image) newErrors.image = "Vui chọn hình ảnh"; // Kiểm tra cả selectedFile và formData.image
    if (!formData.method)
      newErrors.method = "Vui lòng chọn phương thức thanh toán";
    if (!formData.amount) newErrors.amount = "Vui lòng nhập số tiền";
    if (!formData.status)
      newErrors.status = "Vui lòng chọn trạng thái giao dịch";

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
      let avatarUrl = formData.image;
      if (selectedFile) {
        avatarUrl = await uploadFileToFirebase(selectedFile, userTransactionId); // Upload file và lấy URL
      }
      let paydate = "";
      if (isChangeStatus && formData.status === "Đã thanh toán") {
        paydate = new Date();
      }
      const updatedFormData = {
        ...formData,
        image: avatarUrl,
        payment_date: paydate,
      };
      var res;
      if (isEdit) {
        // Chỉnh sửa giao dịch
        res = await authorizedAxiosinstance.put(
          `${API_ROOT}dashboards/updatePayment?paymentId=${userTransactionId}`,
          updatedFormData
        );
      } else {
        // Thêm mới giao dịch
        res = await authorizedAxiosinstance.post(
          `${API_ROOT}dashboards/createPayment`,
          updatedFormData
        );
      }
      if ((!isEdit && res?.status !== 201) || (isEdit && res?.status !== 200)) {
        showToast("Thông báo", res.response?.data?.message, TOAST_TYPES.ERROR);
      } else {
        if (isEdit) {
          showToast(
            "Thông báo",
            "Chỉnh sửa giao dịch thành công",
            TOAST_TYPES.SUCCESS
          );
          fetchProfileData();
        } else {
          showToast(
            "Thông báo",
            "Tạo mới giao dịch thành công",
            TOAST_TYPES.SUCCESS
          );
          navigate("/admin/transactions");
        }
      }
    } catch (error) {
      showToast(
        "Thông báo",
        "Có lỗi xảy ra, vui lòng thử lại.",
        TOAST_TYPES.ERROR
      );
    }
    hideLoader();
  };

  return (
    <div className="user-form-container">
      <div className="timetable-header">
        <h3>{isEdit ? "Chỉnh sửa giao dịch" : " Thêm mới giao dịch"}</h3>
        <Link to={"/admin/transactions"}>
          <Button className="btn mx-auto my-auto" outline color="secondary">
            ← Trở về
          </Button>
        </Link>
      </div>
      <Form onSubmit={handleSubmit}>
        <Row form="true">
          <Col md={4} className="text-center">
            <FormGroup>
              <Label for="image">Hình ảnh</Label>
              <div className="transaction-upload">
                <Input
                  type="file"
                  id="image"
                  name="image"
                  className="d-none"
                  onChange={handleFileChange}
                />
                <label className="avatar-placeholder" htmlFor="image">
                  <img
                    src={previewImage || formData.image || uploadDefault}
                    alt="Avatar"
                    className="avatar-image"
                  />
                </label>

              </div>
              {errors.image && (
                  <FormFeedback style={{ display: "block" }}>
                    {errors.image}
                  </FormFeedback>
                )}
            </FormGroup>
          </Col>
          <Col md={8}>
            <FormGroup>
              <Label for="student_id">
                Học viên <span className="require-input">*</span>
              </Label>
              <Select
                name="selectedStudents"
                options={listStudentData}
                className={`basic-multi-select ${
                  errors.student_id ? "is-invalid" : ""
                }`} // Thêm class is-invalid nếu có lỗi
                classNamePrefix="select"
                value={
                  listStudentData.find(
                    (option) => option.value === formData.student_id
                  ) || null
                }
                onChange={(selectedOptions) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    student_id: selectedOptions ? selectedOptions.value : "",
                  }));
                }}
                placeholder="Chọn học viên"
              />
              {errors.student_id && (
                <FormFeedback style={{ display: "block" }}>
                  {errors.student_id}
                </FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="method">
                Phương Thức Thanh Toán <span className="require-input">*</span>
              </Label>
              <Input
                type="select"
                name="method"
                id="method"
                value={formData?.method || ""}
                onChange={handleInputChange}
                invalid={!!errors.method}
              >
                <option value="" >
                  Phương thức thanh toán
                </option>
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="Chuyển khoản">Chuyển khoản</option>
              </Input>
              {errors.method && <FormFeedback>{errors.method}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for="amount">
                Số tiền <span className="require-input">*</span>
              </Label>
              <Input
                type="text"
                name="amount"
                id="amount"
                value={formData?.amount || ""}
                onChange={handleInputChange}
                invalid={!!errors.amount}
              />
              {errors.amount && <FormFeedback>{errors.amount}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for="status">
                Trạng thái giao dịch <span className="require-input">*</span>
              </Label>
              <Input
                type="select"
                name="status"
                id="status"
                value={formData?.status || ""}
                onChange={handleInputChange}
                invalid={!!errors.status}
              >
                <option value="">
                  Trạng thái giao dịch
                </option>
                <option value="Chưa thanh toán">Chưa thanh toán</option>
                <option value="Đã thanh toán">Đã thanh toán</option>
              </Input>
              {errors.status && <FormFeedback>{errors.status}</FormFeedback>}
            </FormGroup>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="created_at">Ngày tạo giao dịch</Label>
                  <Input
                    type="text"
                    name="created_at"
                    id="created_at"
                    value={
                      isEdit
                        ? moment(formData?.created_at || "")
                            .utc()
                            .format("YYYY-MM-DD HH:mm:ss")
                        : ""
                    }
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="email">Ngày hoàn thành giao dịch</Label>
                  <Input
                    type="text"
                    name="payment_date"
                    id="payment_date"
                    value={
                      isEdit && formData?.payment_date
                        ? moment(formData?.payment_date || "")
                            .utc()
                            .format("YYYY-MM-DD HH:mm:ss")
                        : ""
                    }
                    onChange={handleInputChange}
                    disabled
                  />
                </FormGroup>
              </Col>
            </Row>
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

export default Transaction;
