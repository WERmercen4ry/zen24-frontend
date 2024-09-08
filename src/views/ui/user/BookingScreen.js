import React, { useState } from "react";
import { Container, Row, Col, Button, Badge, Input } from "reactstrap";
import "../../../assets/scss/layout/user_page.scss";
import user3 from "../../../assets/images/users/user3.jpg";
import moment from "moment";
import PtInfoPopUp from "./PtInfoPopUp";
import "../../../assets/scss/layout/user_page.scss";

const BookingScreen = () => {
  const [selectedDate, setSelectedDate] = useState(moment()); // Ngày được chọn
  const [currentMonth, setCurrentMonth] = useState(moment()); // Tháng hiện tại
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // Data mẫu cho lịch và gói tập
  const scheduleData = [
    {
      time: "18:00 - 19:00",
      type: "PILATES 1-4",
      trainer: "HOLLY",
      trainerImg: user3,
      participants: [user3, user3, user3, user3],
      isCompleted: false,
      date: "6/9/2024",
      isFull: true,
      maxParticipants: 4,
      currentParticipants: 4,
    },
    {
      time: "18:00 - 19:00",
      type: "PILATES 1-4",
      trainer: "HOLLY",
      trainerImg: user3,
      participants: [user3, user3, user3, user3],
      isCompleted: false,
      date: "6/9/2024",
      isFull: true,
      maxParticipants: 4,
      currentParticipants: 4,
    },
    {
      time: "18:00 - 19:00",
      type: "PILATES 1-4",
      trainer: "HOLLY",
      trainerImg: user3,
      participants: [user3, user3, user3, user3],
      isCompleted: false,
      date: "6/9/2024",
      isFull: true,
      maxParticipants: 4,
      currentParticipants: 4,
    },
  ];

  // Thông tin gói tập
  const packageInfo = {
    expiryDate: "9-12-2025",
    totalSessions: 144,
    attendedSessions: 74,
    classType: "Pilates",
    level: "1-4",
    packageType: "Gói thường",
    logo: user3,
  };

  return (
    <Container className="workout-history mt-2 card-content">
      {/* Gói tập */}
      <PtInfoPopUp show={showPopup} handleClose={togglePopup} title="My Pop-up">
        <p>This is the content inside the pop-up.</p>
      </PtInfoPopUp>
      <div className="package-info pb-4 border-bottom">
        <h5>Gói tập</h5>
        <div className="p-3 package-card child-content">
          <Row>
            <Col md="9" xs="7">
              <h6>Gói tập của bạn</h6>
              <p className="mb-1 text-muted">
                Ngày hết hạn: {packageInfo.expiryDate}
              </p>
              <p className="mb-1 text-muted">
                Số buổi tập: {packageInfo.attendedSessions}/
                {packageInfo.totalSessions}
              </p>
              <p className="mb-1 text-muted">Lớp: {packageInfo.classType}</p>
              <p className="mb-1 text-muted">Loại: {packageInfo.level}</p>
            </Col>
            <Col md="3" xs="5" className=" align-items-center">
              <div className="d-flex justify-content-center ">
                <img
                  src={packageInfo.logo}
                  width="80"
                  alt="logo"
                  className="package-logo"
                />
              </div>
              <div className="type-package mx-auto">Gói thường</div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Tabs */}
      <Row className="schedule-tabs mt-4">
        <Col xs="6" className="text-center">
          <Button className="active-tab">PILATES</Button>
        </Col>
        <Col xs="6" className="text-center">
          <Button className="inactive-tab">GYM</Button>
        </Col>
      </Row>

      {/* Đặt lịch */}
      <h5 className="mt-3">Đặt lịch</h5>
      <div className="d-flex align-items-center justify-content-center">
        <p className="my-auto me-2 selected-date">Ngày đang được chọn</p>
        <Input
          className="input-date selected-date"
          type="date"
          name="filterDate"
          id="filterDate"
        />
      </div>

      <div className="my-3 child-content">
        {/* Danh sách các buổi tập */}
        {scheduleData.map((session, index) => (
          <Row key={index} className="workout-item mb-2 justify-content-center">
            <Col
              xs="12"
              className="workout-header d-flex justify-content-between"
            >
              <div className="workout-time">{session.time}</div>
            </Col>
            <Row className="p-0 m-1">
              <Col xs="12" className="d-flex justify-content-between">
                <div className="workout-time">{session.type}</div>
              </Col>
              <Col xs="12" className="mt-1">
                <Row>
                  <Col md="1" xs="2">
                    <img
                      src={session.trainerImg}
                      alt="trainer"
                      className="trainer-img"
                      onClick={togglePopup}
                      style={{ cursor: "pointer" }}
                    />
                  </Col>
                  <Col md="9" xs="5" className="workout-trainer">
                    <div>PT: {session.trainer}</div>
                  </Col>
                  <Col
                    md="2"
                    xs="5"
                    className="d-flex align-items-center justify-content-end"
                  >
                    <Button color="primary" size="lg" className="status-btn">
                      Đặt lịch
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col xs="12" className="mt-3 mb-1">
                <Row>
                  <Col
                    xs="10"
                    className="d-flex align-items-center justify-content-between"
                  >
                    {session.participants.length > 0 && (
                      <div className="participants-icons">
                        {session.participants.map((p, i) => (
                          <img
                            key={i}
                            src={p}
                            alt="participant"
                            className="participant-img"
                          />
                        ))}
                      </div>
                    )}
                  </Col>
                  <Col
                    xs="2"
                    className="d-flex justify-content-end align-items-center"
                  >
                    <i className="bi bi-people-fill me-1"></i>
                    <div className="workout-time">4/4</div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Row>
        ))}
      </div>
    </Container>
  );
};

export default BookingScreen;
