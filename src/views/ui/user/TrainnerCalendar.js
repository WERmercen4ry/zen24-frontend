import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Button, Input } from "reactstrap";
import ConfirmPopup from "../../../layouts/user/ConfirmPopup";
import "../../../assets/scss/layout/user_page.scss";
import logo from "../../../assets/images/logos/ZenLogo2.png";
import PtInfoPopUp from "./PtInfoPopUp";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";

const TrainnerCalendar = () => {
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const [showPopup, setShowPopup] = useState(false);
  const [listClass, setListClass] = useState([]);
  const [userId, setUserId] = useState(null);
  const [classId, setClassId] = useState(null);

  const [formSearch, setFormSearch] = useState({
    userId: "",
    type: "Pilates", 
    selectDate: new Date().toISOString().split("T")[0], 
  });

  const [formPopupConfirm, setFormPopupConfirm] = useState({
    message: "",
    title: "",
  });

  const [formRegisClass, setFormRegisClass] = useState({
    userId: "",
    classId: "",
  });

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // Lấy userId từ localStorage và gọi API sau khi userId đã sẵn sàng
  useEffect(() => {
    const userIdGet = localStorage.getItem("userId");
    if (userIdGet) {
      setUserId(userIdGet);
      setFormSearch((prevState) => ({
        ...prevState,
        userId: userIdGet,
      }));
    }
  }, []);

  useEffect(() => {
    showLoader();
    if (userId) {
      fetchClassForUser();
    }
    hideLoader();
  }, [formSearch]); 


  const fetchClassForUser = () => {
    showLoader();
    authorizedAxiosinstance
      .get(`${API_ROOT}dashboards/classes/instructor?instructorId=${formSearch.userId}&selectDate=${formSearch.selectDate}&type=${formSearch.type}`)
      .then((res) => {
        setListClass(res.data?.suitableClasses);
      })
      .catch((error) => {
        console.error("Error fetching class data:", error);
      })

  };

  // Xử lý chọn ngày mới
  const handleDateChange = (e) => {
    setFormSearch((prevState) => ({
      ...prevState,
      selectDate: e.target.value,
    }));
  };

  // Xử lý chuyển đổi giữa Pilates và Gym
  const handleChangeType = (newType) => {
    setFormSearch((prevState) => ({
      ...prevState,
      type: newType, // Cập nhật loại class (Pilates hoặc Gym)
    }));
  };


  return (
    <Container className="workout-history mt-2 card-content">
      {/* Gói tập */}
      <PtInfoPopUp show={showPopup} handleClose={togglePopup} title="My Pop-up" />
      <h5 >Lịch dạy</h5>
      {/* Tabs */}
      <Row className="schedule-tabs mt-4">
        <Col xs="6" className="text-center">
          <Button
            className={formSearch.type === "Pilates" ? "active-tab" : "inactive-tab"}
            onClick={() => handleChangeType("Pilates")}
          >
            PILATES
          </Button>
        </Col>
        <Col xs="6" className="text-center">
          <Button
            className={formSearch.type === "Gym" ? "active-tab" : "inactive-tab"}
            onClick={() => handleChangeType("Gym")}
          >
            GYM
          </Button>
        </Col>
      </Row>

      {/* Đặt lịch */}

      <div className="d-flex align-items-center justify-content-center mt-2">
        <p className="my-auto me-2 selected-date">Ngày đang được chọn</p>
        <Input
          className="input-date selected-date"
          type="date"
          name="filterDate"
          id="filterDate"
          value={formSearch.selectDate} // Đảm bảo date có định dạng đúng
          onChange={handleDateChange} // Cập nhật ngày khi thay đổi
        />
      </div>

      <div className="my-3 child-content">
        {listClass && listClass.length > 0 ? (
          listClass.map((class1, index) => (
            <Row key={index} className="workout-item mb-2 justify-content-center">
              <Col xs="12" className="workout-header d-flex justify-content-between">
                <div className="workout-time">{class1.schedule[0].start_time} - {class1.schedule[0].end_time}</div>
              </Col>
              <Row className="p-0 m-1">
                <Col xs="12" className="d-flex justify-content-between">
                  <div className="workout-time">{class1.type}</div>
                </Col>
                <Col xs="12" className="mt-1">
                  <Row>
                    <Col md="1" xs="2">
                      <img src={class1.schedule[0].instructor.avatar} alt="trainer" className="trainer-img" style={{ cursor: "pointer" }} />
                    </Col>
                    <Col md="9" xs="5" className="workout-trainer">
                      <div>PT: {class1.schedule[0].instructor.profile.name}</div>
                    </Col>
                    <Col md="2" xs="5" className="d-flex align-items-center justify-content-end">
                    </Col>
                  </Row>
                </Col>
                <Col xs="12" className="mt-3 mb-1">
                  <Row>
                    <Col xs="10" className="d-flex align-items-center justify-content-between">
                      {class1.student_in_class.length > 0 && (
                        <div className="participants-icons">
                          {class1.student_in_class.map((p, i) => (
                            <img key={i} src={p.avatar} alt="participant" className="participant-img" />
                          ))}
                        </div>
                      )}
                    </Col>
                    <Col xs="2" className="d-flex justify-content-end align-items-center">
                      <i className="bi bi-people-fill me-1"></i>
                      <div className="workout-time">{class1.student_in_class.length}/{class1.max_members}</div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Row>
          ))
        ) : (
          <span className="text-center">Không có lịch dạy trong ngày này</span>
        )}
      </div>
    </Container>
  );
};

export default TrainnerCalendar;
