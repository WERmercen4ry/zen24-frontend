import React, { useState } from "react";
import { Container, Row, Col, Button, Badge } from "reactstrap";
import "../../../assets/scss/layout/user_page.scss";
import user3 from "../../../assets/images/users/user3.jpg";
import moment from "moment";
import PtInfoPopUp from "./PtInfoPopUp";

const BookingScreen = () => {
  const [selectedDate, setSelectedDate] = useState(moment()); // Ngày được chọn
  const [currentMonth, setCurrentMonth] = useState(moment()); // Tháng hiện tại
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const daysOfWeek = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];

  // Hàm để thay đổi tháng
  const changeMonth = (direction) => {
    if (direction === "prev") {
      setCurrentMonth(moment(currentMonth).subtract(1, "months"));
    } else if (direction === "next") {
      setCurrentMonth(moment(currentMonth).add(1, "months"));
    }
  };

  // Hàm để chọn ngày
  const selectDate = (day) => {
    const selected = moment(currentMonth).date(day);
    setSelectedDate(selected);
  };

  // Hàm lấy danh sách ngày trong tháng hiện tại
  const getDaysInMonth = () => {
    const daysInMonth = [];
    const firstDayOfMonth = moment(currentMonth).startOf("month").day(); // Thứ của ngày đầu tiên trong tháng
    const totalDays = currentMonth.daysInMonth();

    // Thêm khoảng trống nếu ngày đầu tháng không phải Chủ Nhật
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysInMonth.push(null);
    }

    // Thêm các ngày của tháng
    for (let i = 1; i <= totalDays; i++) {
      daysInMonth.push(i);
    }

    return daysInMonth;
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
      <div className="package-info pb-4 border-bottom">
        <PtInfoPopUp
          show={showPopup}
          handleClose={togglePopup}
          title="My Pop-up"
        >
          <p>This is the content inside the pop-up.</p>
        </PtInfoPopUp>
        <h5>Gói tập</h5>
        <div className="p-3 package-card child-content">
          <Row>
            <Col xs="9">
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
            <Col xs="3" className=" align-items-center">
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
      {/* <div className="date-picker">
      
                <Row className="align-items-center">
                    <Col xs="2" className='center-item'>
                        <Button  onClick={() => changeMonth('prev')} className="calendar-arrow">←</Button>
                    </Col>
                    <Col xs="8" className="text-center">
                        <h6>{currentMonth.format('MM-YYYY')}</h6>
                    </Col>
                    <Col xs="2" className='center-item'>
                        <Button  onClick={() => changeMonth('next')} className="calendar-arrow">→</Button>
                    </Col>
                </Row>


                <Row className="days-of-week">
                    {daysOfWeek.map((day, index) => (
                        <div key={index} className="grid-item text-center">
                            {day}
                        </div>
                    ))}
                </Row>


                <Row className="days-in-month days-of-week">
                    {getDaysInMonth().map((day, index) => (
                        <div key={index} className="text-center ">
                            {day ? (
                                <div
                                    className={`day ${selectedDate.date() === day && selectedDate.isSame(currentMonth, 'month') ? 'active-day' : ''}`}
                                    onClick={() => selectDate(day)}
                                >
                                    {day}
                                </div>
                            ) : (
                                <div className="empty-day"></div> // Ngày trống để căn chỉnh các ngày
                            )}
                        </div>
                    ))}
                </Row>
            </div> */}
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
