import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const TimetablePopup = ({
  isOpen,
  toggle,
  isEdit = false,
  timetable = null,
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [listTrainerData, setlistTrainerData] = useState([]);
  const [listLocationData, setlistLocationData] = useState([]);
  const [listPackageData, setlistPackageData] = useState([]);
  const [errorAPI, setErrorAPI] = useState("");

  const [formData, setFormData] = useState({
    packages: "",
    type: "",
    max_members: 0,
    schedule: [
      {
        location: "",
        day: moment().format("YYYY-MM-DD"),
        start_time: "15:00",
        end_time: "16:00",
        instructor: [""],
      },
    ],
  });

  const [errors, setErrors] = useState({});

  // Fetch dữ liệu cần thiết khi mở modal
  useEffect(() => {
    fetchTrainer();
    fetchLocation();
    fetchPackage();
  }, []);

  const fetchTrainer = () => {
    authorizedAxiosinstance
      .get(`${API_ROOT}/users/getUsersByRole`, {
        params: {
          role: "Trainer",
        },
      })
      .then((res) => {
        setlistTrainerData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching trainer data:", error);
      });
  };

  const fetchLocation = () => {
    authorizedAxiosinstance
      .get(`${API_ROOT}/dashboards/getListLocations`)
      .then((res) => {
        setlistLocationData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
      });
  };

  const fetchPackage = () => {
    authorizedAxiosinstance
      .get(`${API_ROOT}/dashboards/packages`)
      .then((res) => {
        setlistPackageData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching package data:", error);
      });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    const packageData = listPackageData.filter(
      (Package) => Package._id === value
    );
    setFormData({
      ...formData,
      [name]: value,
      type: packageData[0].type,
      max_members: packageData[0].max_members,
    });
  };

  const updateScheduleLocation = (event) => {
    const { value } = event.target;
    const newSchedule = [...formData.schedule];
    newSchedule[0].location = value;
    setFormData({ ...formData, schedule: newSchedule });
  };

  const updateScheduleInstructor = (event) => {
    const { value } = event.target;
    const newSchedule = [...formData.schedule];
    newSchedule[0].instructor[0] = value;
    setFormData({ ...formData, schedule: newSchedule });
  };

  const updateScheduleDay = (value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[0].day = value;
    setFormData({ ...formData, schedule: newSchedule });
  };

  const updateScheduleStartTime = (index, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index].start_time = value;
    setFormData({ ...formData, schedule: newSchedule });
  };

  const updateScheduleEndTime = (index, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index].end_time = value;
    setFormData({ ...formData, schedule: newSchedule });
  };

  const validateForm = () => {
    const newErrors = {};
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!formData.packages) newErrors.packages = "Vui lòng chọn gói";
    if (!formData.schedule[0].location)
      newErrors.location = "Vui lòng chọn chi nhánh";
    if (!formData.schedule[0].instructor[0])
      newErrors.instructor = "Vui lòng chọn Trainer";
    if (!formData.schedule[0].start_time)
      newErrors.start_time = "Vui lòng nhập thời gian bắt đầu";
    else if (!timeRegex.test(formData.schedule[0].start_time))
      newErrors.start_time = "Thời gian bắt đầu không hợp lệ (hh:mm)";
    if (!formData.schedule[0].end_time)
      newErrors.end_time = "Vui lòng nhập thời gian kết thúc";
    else if (!timeRegex.test(formData.schedule[0].end_time))
      newErrors.end_time = "Thời gian kết thúc không hợp lệ (hh:mm)";
    if (!formData.schedule[0].day) newErrors.day = "Vui lòng chọn ngày";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEdit) {
        // Gọi API update thời khoá biểu cần edit
      } else {
        // Gọi API thêm mới khi ở chế độ thêm mới
        const res = await authorizedAxiosinstance.post(
          `${API_ROOT}dashboards/createClass`,
          formData
        );
        console.log("res", res);

        if (res.status === 201) {
          window.location.reload();
          toggle();
        }
        console.log("res", res);
        if (res.status === 207) {
          console.log(`Huấn luyện viên đã có lịch học vào thời gian này.`);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        {isEdit ? "Chỉnh sửa thời khoá biểu" : "Thêm thời khoá biểu mới"}
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col>
            <Form onSubmit={submitForm}>
              <Row className="mt-3">
                <Col>
                  <FormGroup>
                    <Label for="exampleSelect">Chi Nhánh</Label>
                    <Input
                      id="exampleSelect"
                      name="location"
                      type="select"
                      placeholder="Chọn chi nhánh"
                      value={formData.schedule[0].location}
                      onChange={updateScheduleLocation}
                    >
                      <option value="" disabled>
                        Chọn chi nhánh
                      </option>
                      {listLocationData.map((Location) => (
                        <option key={Location._id} value={Location._id}>
                          {Location.name}
                        </option>
                      ))}
                    </Input>
                    {errors.location && (
                      <div style={{ color: "red" }}>{errors.location}</div>
                    )}
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="exampleSelect">Trainer</Label>
                    <Input
                      id="exampleSelect"
                      name="Trainer"
                      type="select"
                      placeholder="Chọn Trainer"
                      value={formData.schedule[0].instructor[0]}
                      onChange={updateScheduleInstructor}
                    >
                      <option value="" disabled>
                        Chọn Trainer
                      </option>
                      {listTrainerData.map((Trainer) => (
                        <option key={Trainer.id} value={Trainer.id}>
                          {Trainer.profile.name}
                        </option>
                      ))}
                    </Input>
                    {errors.instructor && (
                      <div style={{ color: "red" }}>{errors.instructor}</div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="exampleSelect">Gói</Label>
                    <Input
                      id="exampleSelect"
                      name="packages"
                      type="select"
                      placeholder="Chọn gói"
                      value={formData.packages}
                      onChange={handleSelectChange}
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
                    {errors.packages && (
                      <div style={{ color: "red" }}>{errors.packages}</div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <FormGroup>
                    <Label>Thời gian bắt đầu</Label>
                    <Input
                      placeholder="15:00"
                      type="time"
                      value={formData.schedule[0].start_time}
                      onChange={(e) =>
                        updateScheduleStartTime(0, e.target.value)
                      }
                    />
                    {errors.start_time && (
                      <div style={{ color: "red" }}>{errors.start_time}</div>
                    )}
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label>Thời gian kết thúc</Label>
                    <Input
                      type="time"
                      placeholder="16:00"
                      value={formData.schedule[0].end_time}
                      onChange={(e) => updateScheduleEndTime(0, e.target.value)}
                    />
                    {errors.end_time && (
                      <div style={{ color: "red" }}>{errors.end_time}</div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label>Ngày</Label>
                    <Input
                      type="date"
                      value={formData.schedule[0].day}
                      onChange={(e) => updateScheduleDay(e.target.value)}
                    />
                    {errors.day && (
                      <div style={{ color: "red" }}>{errors.day}</div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <ModalFooter>
                <Button color="primary" type="submit">
                  {isEdit ? "Cập nhật" : "Thêm mới"}
                </Button>
                <Button color="secondary" onClick={toggle}>
                  Hủy
                </Button>
              </ModalFooter>
            </Form>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default TimetablePopup;
