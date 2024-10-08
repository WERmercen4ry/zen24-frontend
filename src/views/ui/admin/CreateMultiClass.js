import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Table,
  FormFeedback,
} from "reactstrap";
import Select from "react-select"; // Import thư viện react-select
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";
import { useToast } from "../../../layouts/admin/ToastContext";
import { TOAST_TYPES } from "../../../utils/constant";

const CreateMultiClass = ({ isOpen, toggle }) => {
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { showToast } = useToast();

  // State chung cho tất cả form input
  const [formData, setFormData] = useState({
    selectedBranch: "",
    selectedTrainers: [],
    selectedPackage: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    selectedDays: [],
  });
  const [listTrainerData, setListTrainerData] = useState([]);
  const [listLocationData, setListLocationData] = useState([]);
  const [listPackageData, setListPackageData] = useState([]);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]); // State cho dữ liệu bảng
  const [existingClasses, setExistingClasses] = useState([]); // Bảng cho lớp đã tồn tại
  const [createdClasses, setCreatedClasses] = useState([]);
  const resetFormData = () => {
    setFormData({
      selectedBranch: "",
      selectedTrainers: [],
      selectedPackage: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      selectedDays: [],
    });
    setTableData([]);
    setExistingClasses([]);
    setCreatedClasses([]);
    setIsConfirm(false);
    setIsSaved(false);
    setErrors({});
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    let newErrors = {};
    const currentDate = new Date().toISOString().split("T")[0];

    // Validate ngày
    if (!formData.startDate || formData.startDate < currentDate) {
      newErrors.startDate = "Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại";
    }
    if (!formData.endDate || formData.endDate <= formData.startDate) {
      newErrors.endDate = "Ngày kết thúc phải lớn hơn ngày bắt đầu";
    }

    // Validate thời gian
    if (!formData.startTime) {
      newErrors.startTime = "Vui lòng chọn thời gian bắt đầu";
    }
    if (!formData.endTime || formData.endTime <= formData.startTime) {
      newErrors.endTime = "Thời gian kết thúc phải lớn hơn thời gian bắt đầu";
    }

    // Validate huấn luyện viên
    if (formData.selectedTrainers.length === 0) {
      newErrors.selectedTrainers = "Vui lòng chọn ít nhất một huấn luyện viên";
    }

    // Validate chi nhánh
    if (!formData.selectedBranch) {
      newErrors.selectedBranch = "Vui lòng chọn chi nhánh";
    }

    // Validate gói dịch vụ
    if (!formData.selectedPackage) {
      newErrors.selectedPackage = "Vui lòng chọn gói dịch vụ";
    }

    // Validate ngày trong tuần
    if (formData.selectedDays.length === 0) {
      newErrors.selectedDays = "Vui lòng chọn ít nhất một ngày trong tuần";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validate()) {
      // Tạo danh sách data cho bảng từ form input
      const newTableData = formData.selectedTrainers.map((trainer) => ({
        trainer: trainer.label, // Huấn luyện viên từ danh sách chọn
        branch: listLocationData.find(
          (location) => location.value === formData.selectedBranch
        )?.label, // Chi nhánh
        package: listPackageData.find(
          (pkg) => pkg.value === formData.selectedPackage
        )?.label, // Gói
        days: formData.selectedDays.join(", "), // Thứ (Ngày trong tuần)
        startDate: formData.startDate, // Ngày bắt đầu
        endDate: formData.endDate, // Ngày kết thúc
        startTime: formData.startTime, // Thời gian bắt đầu
        endTime: formData.endTime, // Thời gian kết thúc
      }));
      setIsConfirm(true);
      setTableData(newTableData); // Cập nhật dữ liệu bảng
    }
  };
  useEffect(() => {
    if (!isOpen) {
      resetFormData(); // Reset dữ liệu khi modal đóng
    }
  }, [isOpen]);
  useEffect(() => {
    fetchTrainer();
    fetchLocation();
    fetchPackage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTrainer = () => {
    authorizedAxiosinstance
      .get(`${API_ROOT}users/getUsersByRole`, {
        params: {
          role: "Trainer",
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
          const trainerOptions = res.data.map((trainer) => ({
            value: trainer.id,
            label: trainer.profile.name,
          }));
          setListTrainerData(trainerOptions);
        }
      })
      .catch((error) => {
        console.error("Error fetching trainer data:", error);
      });
  };

  const fetchLocation = () => {
    authorizedAxiosinstance
      .get(`${API_ROOT}dashboards/getListLocations`)
      .then((res) => {
        if (res.status !== 200) {
          showToast(
            "Thông báo",
            res.response?.data?.message,
            TOAST_TYPES.ERROR
          );
        } else {
          const locationOptions = res.data.map((location) => ({
            value: location._id,
            label: location.name,
            address: location.address,
          }));
          setListLocationData(locationOptions);
        }
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
      });
  };

  const fetchPackage = () => {
    authorizedAxiosinstance
      .get(`${API_ROOT}dashboards/packages`)
      .then((res) => {
        if (res.status !== 200) {
          showToast(
            "Thông báo",
            res.response?.data?.message,
            TOAST_TYPES.ERROR
          );
        } else {
          const packageOptions = res.data.map((pkg) => ({
            value: pkg._id,
            label: pkg.name,
          }));
          setListPackageData(packageOptions);
        }
      })
      .catch((error) => {
        console.error("Error fetching package data:", error);
      });
  };

  const handleSaveChanges = async () => {
    showLoader();
    if (validate()) {
      // Tạo formData cho API dựa trên dữ liệu người dùng nhập
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      const classDatas = [];
      const currentDate = new Date(startDate);

      // Lặp qua từng ngày trong khoảng startDate đến endDate
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay() + 1; // Lấy thứ hiện tại (1-7)
        const dayFormatted = currentDate.toISOString().split("T")[0]; // format yyyy-mm-dd

        // Nếu ngày hiện tại trùng với thứ mà user đã chọn, thêm vào classDatas
        if (
          formData.selectedDays.includes(dayOfWeek.toString()) ||
          (dayOfWeek === 1 && formData.selectedDays.includes("CN"))
        ) {
          classDatas.push({
            location: formData.selectedBranch,
            start_time: formData.startTime,
            end_time: formData.endTime,
            day: dayFormatted,
          });
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Tạo đối tượng formData để gửi API
      const dataToSubmit = {
        packages: [formData.selectedPackage],
        classDatas: classDatas,
        instructors: formData.selectedTrainers.map((trainer) => trainer.value),
      };

      try {
        const res = await authorizedAxiosinstance.post(
          `${API_ROOT}dashboards/createManyClass`,
          dataToSubmit
        );

        if (res.status === 207 || res.status === 201) {
          setExistingClasses(res.data?.existingClasses);
          setCreatedClasses(res.data?.classes);
          showToast(
            "Thông báo",
            "Tạo lịch tập thành công",
            TOAST_TYPES.SUCCESS
          );
          setIsConfirm(true);
        } else {
          showToast(
            "Thông báo",
            res.response?.data?.message,
            TOAST_TYPES.ERROR
          );
        }
      } catch (error) {
        showToast("Thông báo", error, TOAST_TYPES.ERROR);
      }
      hideLoader();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Tạo Lịch Tập</ModalHeader>
      <ModalBody>
        <Row>
          <Col md={4}>
            <FormGroup>
              <Label for="selectedBranch">Lọc chi nhánh:</Label>
              <Input
                type="select"
                name="selectedBranch"
                id="selectedBranch"
                value={formData.selectedBranch}
                onChange={handleInputChange}
                invalid={!!errors.selectedBranch}
              >
                <option value="">Chọn chi nhánh</option>
                {listLocationData.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.label + ", " + location.address}
                  </option>
                ))}
              </Input>
              {errors.selectedBranch && (
                <FormFeedback>{errors.selectedBranch}</FormFeedback>
              )}
            </FormGroup>
          </Col>
          <Col md={8}>
            <FormGroup>
              <Label for="trainer">Tìm kiếm huấn luyện viên:</Label>
              <Select
                isMulti
                name="selectedTrainers"
                options={listTrainerData}
                className="basic-multi-select"
                classNamePrefix="select"
                value={formData.selectedTrainers}
                onChange={(selectedOptions) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    selectedTrainers: selectedOptions || [],
                  }));
                }}
                placeholder="Chọn huấn luyện viên"
              />
              {errors.selectedTrainers && (
                <div className="text-danger">{errors.selectedTrainers}</div>
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <FormGroup>
              <Label for="selectedPackage">Lọc gói:</Label>
              <Input
                type="select"
                name="selectedPackage"
                id="selectedPackage"
                value={formData.selectedPackage}
                onChange={handleInputChange}
                invalid={!!errors.selectedPackage}
              >
                <option value="">Chọn gói</option>
                {listPackageData.map((pkg) => (
                  <option key={pkg.value} value={pkg.value}>
                    {pkg.label}
                  </option>
                ))}
              </Input>
              {errors.selectedPackage && (
                <FormFeedback>{errors.selectedPackage}</FormFeedback>
              )}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="startDate">Ngày bắt đầu:</Label>
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
          <Col md={4}>
            <FormGroup>
              <Label for="endDate">Ngày kết thúc:</Label>
              <Input
                type="date"
                name="endDate"
                id="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                invalid={!!errors.endDate}
              />
              {errors.endDate && <FormFeedback>{errors.endDate}</FormFeedback>}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <FormGroup>
              <Label for="startTime">Thời gian bắt đầu:</Label>
              <Input
                type="time"
                name="startTime"
                id="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                invalid={!!errors.startTime}
              />
              {errors.startTime && (
                <FormFeedback>{errors.startTime}</FormFeedback>
              )}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="endTime">Thời gian kết thúc:</Label>
              <Input
                type="time"
                name="endTime"
                id="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                invalid={!!errors.endTime}
              />
              {errors.endTime && <FormFeedback>{errors.endTime}</FormFeedback>}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={10}>
            <FormGroup check inline>
              <Label className="px-4 ps-0" check>
                <Input
                  type="checkbox"
                  value="2"
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      selectedDays: e.target.checked
                        ? [...prevData.selectedDays, e.target.value]
                        : prevData.selectedDays.filter(
                            (day) => day !== e.target.value
                          ),
                    }))
                  }
                />
                Thứ 2
              </Label>
              <Label className="px-4" check>
                <Input
                  type="checkbox"
                  value="3"
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      selectedDays: e.target.checked
                        ? [...prevData.selectedDays, e.target.value]
                        : prevData.selectedDays.filter(
                            (day) => day !== e.target.value
                          ),
                    }))
                  }
                />
                Thứ 3
              </Label>
              <Label className="px-4" check>
                <Input
                  type="checkbox"
                  value="4"
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      selectedDays: e.target.checked
                        ? [...prevData.selectedDays, e.target.value]
                        : prevData.selectedDays.filter(
                            (day) => day !== e.target.value
                          ),
                    }))
                  }
                />
                Thứ 4
              </Label>
              <Label className="px-4" check>
                <Input
                  type="checkbox"
                  value="5"
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      selectedDays: e.target.checked
                        ? [...prevData.selectedDays, e.target.value]
                        : prevData.selectedDays.filter(
                            (day) => day !== e.target.value
                          ),
                    }))
                  }
                />
                Thứ 5
              </Label>
              <Label className="px-4" check>
                <Input
                  type="checkbox"
                  value="6"
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      selectedDays: e.target.checked
                        ? [...prevData.selectedDays, e.target.value]
                        : prevData.selectedDays.filter(
                            (day) => day !== e.target.value
                          ),
                    }))
                  }
                />
                Thứ 6
              </Label>
              <Label className="px-4" check>
                <Input
                  type="checkbox"
                  value="7"
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      selectedDays: e.target.checked
                        ? [...prevData.selectedDays, e.target.value]
                        : prevData.selectedDays.filter(
                            (day) => day !== e.target.value
                          ),
                    }))
                  }
                />
                Thứ 7
              </Label>
              <Label className="px-4" check>
                <Input
                  type="checkbox"
                  value="CN"
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      selectedDays: e.target.checked
                        ? [...prevData.selectedDays, e.target.value]
                        : prevData.selectedDays.filter(
                            (day) => day !== e.target.value
                          ),
                    }))
                  }
                />
                Chủ nhật
              </Label>
            </FormGroup>
            {errors.selectedDays && (
              <div className="text-danger">{errors.selectedDays}</div>
            )}
          </Col>
          <Col md={2} className="d-flex justify-content-end">
            <Button color="primary" onClick={handleConfirm}>
              Xác nhận
            </Button>
          </Col>
        </Row>
        {!isSaved && (
          <div className="mt-4">
            <h5 className="text-muted">Tạo lịch tập</h5>
            <Table responsive borderless>
              <thead>
                <tr>
                  <th className="text-muted">Huấn luyện viên</th>
                  <th className="text-muted">Loại</th>
                  <th className="text-muted">Chi nhánh</th>
                  <th className="text-muted">Thứ</th>
                  <th className="text-muted">Ngày bắt đầu</th>
                  <th className="text-muted">Ngày kết thúc</th>
                  <th className="text-muted">Thời gian bắt đầu</th>
                  <th className="text-muted">Thời gian kết thúc</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index} className="border-top">
                    <td>{row.trainer}</td>
                    <td>{row.package}</td>
                    <td>{row.branch}</td>
                    <td>{row.days}</td>
                    <td>{row.startDate}</td>
                    <td>{row.endDate}</td>
                    <td>{row.startTime}</td>
                    <td>{row.endTime}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        {/* Table for Existing Classes */}
        {existingClasses.length > 0 && (
          <div className="mt-4">
            <h5 className="text-muted">Lịch không thể tạo vì đã tồn tại</h5>
            <Table responsive borderless>
              <thead>
                <tr>
                  <th>Huấn luyện viên</th>
                  <th>Ngày</th>
                  <th>Thời gian bắt đầu</th>
                  <th>Thời gian kết thúc</th>
                </tr>
              </thead>
              <tbody>
                {existingClasses.map((classItem, index) => (
                  <tr key={index} className="border-top">
                    <td>{classItem.instructor}</td>
                    <td>{new Date(classItem.day).toLocaleDateString()}</td>
                    <td>{classItem.start_time}</td>
                    <td>{classItem.end_time}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Table for Created Classes */}
        {createdClasses.length > 0 && (
          <div className="mt-4">
            <h5 className="text-muted">Lịch đã tạo thành công</h5>
            <Table responsive borderless>
              <thead>
                <tr>
                  <th>Huấn luyện viên</th>
                  <th>Ngày</th>
                  <th>Thời gian bắt đầu</th>
                  <th>Thời gian kết thúc</th>
                </tr>
              </thead>
              <tbody>
                {createdClasses.map((classItem, index) => (
                  <tr key={index} className="border-top">
                    <td>{classItem.instructor}</td>
                    <td>{new Date(classItem.day).toLocaleDateString()}</td>
                    <td>{classItem.start_time}</td>
                    <td>{classItem.end_time}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Đóng
        </Button>
        <Button
          color="primary"
          onClick={handleSaveChanges}
          disabled={!isConfirm}
        >
          Lưu thay đổi
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateMultiClass;
