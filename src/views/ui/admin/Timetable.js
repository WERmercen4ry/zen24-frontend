import {
  Card,
  Row,
  Col,
  CardTitle,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
const Timetable = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [listTrainerData, setlistTrainerData] = useState([]);
  //list location
  const [listLocationData, setlistLocationData] = useState([]);
  //list package
  const [listPackageData, setlistPackageData] = useState([]);
  const [formData, setFormData] = useState({
    packages: "",
    type: "",
    max_members: 0,
    schedule: [
      {
        location: "",
        day: "",
        start_time: "",
        end_time: "",
        instructor: [""],
      },
    ],
  });
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
        console.error("Error fetching transaction data:", error);
      });
  };
  const fetchLocation = () => {
    authorizedAxiosinstance
      .get(`${API_ROOT}/dashboards/getListLocations`)
      .then((res) => {
        setlistLocationData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching transaction data:", error);
      });
  };
  const fetchPackage = () => {
    authorizedAxiosinstance
      .get(`${API_ROOT}/dashboards/packages`)
      .then((res) => {
        // Set the transaction data from the API response
        setlistPackageData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching transaction data:", error);
      });
  };

  useEffect(() => {
    console.log("asasasa", formData);
  }, [formData]);

  const submitRegister = async (event) => {
    event.preventDefault();

    //fileter listPackageData follow formData.packages

    console.log(formData);

    try {
      const res = await authorizedAxiosinstance
        .post(`${API_ROOT}dashboards/createClass`, formData)
        .then((res) => {
          console.log(res);
          navigate("/admin/timetables");
        });
    } catch (error) {
      setError("Error fetching transaction data:", error);
    }
  };
  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    const packageData = listPackageData.filter((Package) => {
      return Package._id === value;
    });
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
    setFormData({
      ...formData,
      schedule: newSchedule,
    });
  };
  const updateScheduleInstructor = (event) => {
    const { value } = event.target;
    const newSchedule = [...formData.schedule];
    newSchedule[0].instructor[0] = value;
    setFormData({
      ...formData,
      schedule: newSchedule,
    });
  };
  const updateScheduleDay = (value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[0].day = value;
    setFormData({
      ...formData,
      schedule: newSchedule,
    });
  };
  const updateScheduleStartTime = (index, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index].start_time = value;
    setFormData({
      ...formData,
      schedule: newSchedule,
    });
  };

  // Function to update the schedule end_time
  const updateScheduleEndTime = (index, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index].end_time = value;
    setFormData({
      ...formData,
      schedule: newSchedule,
    });
  };

  // function set time
  return (
    <Row>
      <Col>
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-card-text me-2"> </i>
            Thêm thời khoá biểu mới
          </CardTitle>
          <CardBody className="pt-0">
            <Form>
              <Row className="mt-3">
                <Col>
                  <FormGroup>
                    <Label for="exampleEmail">Chi Nhánh</Label>
                    <Input
                      id="exampleSelect"
                      name="location"
                      type="select"
                      placeholder="Chọn chi nhánh"
                      value={formData.schedule.location}
                      onChange={updateScheduleLocation}
                    >
                      <option value="" disabled selected>
                        Chọn chi nhánh
                      </option>
                      {listLocationData.map((Location) => (
                        <option key={Location._id} value={Location._id}>
                          {Location.name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="exampleEmail">Trainer</Label>
                    <Input
                      id="exampleSelect"
                      name="Trainer"
                      type="select"
                      placeholder="Chọn Trainer"
                      value={formData.schedule.instructor}
                      onChange={updateScheduleInstructor}
                    >
                      <option value="" disabled selected>
                        Chọn Trainer
                      </option>
                      {listTrainerData.map((Trainer) => (
                        <option key={Trainer.id} value={Trainer.id}>
                          {Trainer.profile.name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="exampleEmail">Gói</Label>
                    <Input
                      id="exampleSelect"
                      name="packages"
                      type="select"
                      placeholder="Chọn chi gói"
                      onChange={handleSelectChange}
                    >
                      <option value="" disabled selected>
                        Chọn gói
                      </option>
                      {listPackageData.map((Package) => (
                        <option key={Package._id} value={Package._id}>
                          {Package.name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            Lịch
          </CardTitle>
          <CardBody className="pt-0">
            <Form onSubmit={submitRegister}>
              <Row className="mt-3">
                <Col>
                  <FormGroup>
                    <Label for="exampleEmail">Thời gian bắt đầu</Label>
                    <Input
                      id="exampleEmail"
                      name="email"
                      placeholder="15:00"
                      type="text"
                      onChange={(e) =>
                        updateScheduleStartTime(0, e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="exampleEmail">Thời gian kết thúc</Label>
                    <Input
                      id="exampleEmail"
                      name="email"
                      placeholder="16:00"
                      type="text"
                      onChange={(e) => updateScheduleEndTime(0, e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="exampleEmail">Ngày</Label>
                    <Input
                      className="date-time"
                      type="date"
                      name="startDate"
                      id="startDate"
                      onChange={(e) => updateScheduleDay(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="btn-form">
                <Link to={"/admin/timetables"}>
                  <Button className="mt-2 btn-secondary me-2">Huỷ</Button>
                </Link>

                <Button color="primary" className="mt-2 btn">
                  Thêm mới
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Timetable;
