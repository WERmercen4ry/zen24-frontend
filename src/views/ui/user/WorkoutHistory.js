import "../../../assets/scss/layout/user_page.scss";

import React from "react";
import { Container, Row, Col, Button, Badge } from "reactstrap";
import user3 from "../../../assets/images/users/user3.jpg";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { useEffect, useState } from "react";
import moment from "moment";
import ConfirmPopup from "../../../layouts/admin/ConfirmPopup";

import { API_ROOT } from "../../../utils/constant";
const WorkoutHistory = () => {
  const [trainingHistory, settrainingHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [currentClass, setCurrentClass] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [trainingHistoryFuture, settrainingHistoryFuture] = useState([]);

  const currentUser = localStorage.getItem("userId");

  useEffect(() => {
    fetchTransactions();
  }, []);
  const togglePopup = (currentClass) => {
    if (currentClass) {
      setCurrentClass(currentClass);
    }
    setIsOpen(!isOpen);
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "Ngày") {
      fetchTransactions(
        moment().format("YYYY-MM-DD"),
        moment().format("YYYY-MM-DD")
      );
    }
    if (tab === "Tất cả") {
      fetchTransactions();
    }
    if (tab === "Tuần") {
      fetchTransactions(
        moment().startOf("week").format("YYYY-MM-DD"),
        moment().endOf("week").format("YYYY-MM-DD")
      );
    }
    if (tab === "Tháng") {
      fetchTransactions(
        moment().startOf("month").format("YYYY-MM-DD"),
        moment().endOf("month").format("YYYY-MM-DD")
      );
    }
  };
  const fetchTransactions = (startDate, endDate) => {
    authorizedAxiosinstance
      .get(`${API_ROOT}/users/training-history`, {
        params: {
          userId: currentUser,
          startDate: startDate,
          endDate: endDate,
        },
      })
      .then((res) => {
        // Set the transaction data from the API response
        console.log(JSON.stringify(res));

        const { pastSchedules, futureSchedules } = filterSchedules(res.data);
        settrainingHistoryFuture(futureSchedules);
        settrainingHistory(pastSchedules);
      })
      .catch((error) => {
        console.error("Error fetching transaction data:", error);
      });
  };
  function filterSchedules(data) {
    const pastSchedules = [];
    const futureSchedules = [];

    data.forEach((item) => {
      const scheduleDate = new Date(item.schedule[0].day);
      const now = new Date();

      if (scheduleDate < now) {
        pastSchedules.push(item);
      } else if (scheduleDate > now) {
        futureSchedules.push(item);
      }
    });

    return {
      pastSchedules: pastSchedules,
      futureSchedules: futureSchedules,
    };
  }

  const cancleClass = (currentClass) => {
    console.log(currentClass);
    authorizedAxiosinstance
      .delete(`${API_ROOT}/users/cancelClassRegistration`, {
        params: {
          userId: currentUser,
          classId: currentClass._id
        },
      }).then((res) => {

        // TODO: show toasts
        handleTabClick(activeTab)
      })
  };

  const handleConfirm = async () => {
    // Xử lý sự kiện khi người dùng nhấn "Delete"
    togglePopup();
    cancleClass(currentClass);
    console.log(currentClass);
  };
  return (
    <div>
      <ConfirmPopup
        isOpen={isOpen}
        toggle={togglePopup}
        onConfirm={handleConfirm}
        message={
          "Are you sure you want to delete this item? This action cannot be undone."
        }
      />
      <Container className="workout-history mt-2 card-content">
        {/* Tiêu đề */}
        <Row>
          <Col className="text-center">
            <h2 className="history-title">LỊCH SỬ LUYỆN TẬP</h2>
          </Col>
        </Row>

        {/* Tabs */}
        <Row className="history-tabs">
          <Col xs="3" className="text-center px-2p">
            <Button
              className={activeTab === "Tất cả" ? "active-tab" : "inactive-tab"}
              onClick={() => handleTabClick("Tất cả")}
            >
              Tất cả
            </Button>
          </Col>
          <Col xs="3" className="text-center px-2p">
            <Button
              className={activeTab === "Ngày" ? "active-tab" : "inactive-tab"}
              onClick={() => handleTabClick("Ngày")}
            >
              Ngày
            </Button>
          </Col>
          <Col xs="3" className="text-center px-2p">
            <Button
              className={activeTab === "Tuần" ? "active-tab" : "inactive-tab"}
              onClick={() => handleTabClick("Tuần")}
            >
              Tuần
            </Button>
          </Col>
          <Col xs="3" className="text-center px-2p">
            <Button
              className={activeTab === "Tháng" ? "active-tab" : "inactive-tab"}
              onClick={() => handleTabClick("Tháng")}
            >
              Tháng
            </Button>
          </Col>
        </Row>

        {/* Danh sách các buổi tập */}
        {trainingHistoryFuture.map((session, index) => (
          <Row key={index} className="workout-item mb-3 justify-content-center">
            <Col
              xs="12"
              className="workout-header d-flex justify-content-between"
            >
              <div className="workout-time">
                {session.schedule[0].start_time} -{" "}
                {session.schedule[0].end_time}
              </div>
              <div className="workout-date">
                {session.schedule[0].day.split("T")[0]}
              </div>
            </Col>

            <Row className="p-0 m-1">
              <Col xs="12" className="d-flex justify-content-between">
                <div className="workout-time">{session.type}</div>
              </Col>
              <Col xs="12" className="mt-1">
                <Row>
                  <Col md="1" xs="2">
                    <img
                      src={session.schedule[0].instructor.avatar}
                      alt="trainer"
                      className="trainer-img"
                    />
                  </Col>
                  <Col md="9" xs="5" className="workout-trainer">
                    <div>PT: {session.schedule[0].instructor.profile.name}</div>
                  </Col>
                  <Col
                    md="2"
                    xs="5"
                    className="d-flex align-items-center justify-content-end"
                  >
                    <Button
                      color="danger"
                      size="lg"
                      className="status-btn"
                      onClick={() => togglePopup(session)}
                    >
                      Hủy
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
                    {session.student_in_class.length > 0 && (
                      <div className="participants-icons">
                        {session.student_in_class.map((p, i) => (
                          <img
                            key={i}
                            src={p.avatar}
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
                    <div className="workout-time">
                      {session.student_in_class.length}/
                      {session.packages[0].max_members}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Row>
        ))}
        {trainingHistory.map((session, index) => (
          <Row key={index} className="workout-item mb-3 justify-content-center">
            <Col
              xs="12"
              className="workout-header d-flex justify-content-between"
            >
              <div className="workout-time">
                {session.schedule[0].start_time} -{" "}
                {session.schedule[0].end_time}
              </div>
              <div className="workout-date">
                {session.schedule[0].day.split("T")[0]}
              </div>
            </Col>

            <Col xs="12" className="d-flex justify-content-between">
              <div className="workout-time">
                {session.type +
                  " / PT: " +
                  session.schedule[0].instructor.profile.name}
              </div>
            </Col>
          </Row>
        ))}
      </Container>
    </div>
  );
};

export default WorkoutHistory;
