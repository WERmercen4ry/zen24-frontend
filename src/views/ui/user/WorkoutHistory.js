import "../../../assets/scss/layout/user_page.scss";

import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { useEffect, useState, useContext } from "react";
import moment from "moment";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";
import ConfirmPopup from "../../../layouts/user/ConfirmPopup";
import { API_ROOT } from "../../../utils/constant";
import PtInfoPopUp from "./PtInfoPopUp";
const WorkoutHistory = () => {
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const [trainingHistory, settrainingHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [currentClass, setCurrentClass] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [trainingHistoryFuture, settrainingHistoryFuture] = useState([]);
  const [isConfirm, setIsConfirm] = useState(true);
  const currentUser = localStorage.getItem("userId");
  const [formPopupConfirm, setFormPopupConfirm] = useState({
    message: "",
    title: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  const toggle = () => setIsOpen(!isOpen);
  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    showLoader();
    authorizedAxiosinstance
      .get(`${API_ROOT}users/training-history`, {
        params: {
          userId: currentUser,
          startDate: startDate,
          endDate: endDate,
        },
      })
      .then((res) => {
        const { pastSchedules, futureSchedules } = filterSchedules(res.data);

        settrainingHistoryFuture(futureSchedules);
        settrainingHistory(pastSchedules);
        hideLoader();
      })
      .catch((error) => {
        console.error("Error fetching transaction data:", error);
        hideLoader();
      });
  };
  function filterSchedules(data) {
    const pastSchedules = [];
    const futureSchedules = [];

    data.forEach((item) => {
      const scheduleDate = new Date(item.schedule[0].day);
      const now = new Date();
      now.setDate(now.getDate() - 1);
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
  const showNotification = (message) => {
    setIsConfirm(false);
    setFormPopupConfirm({
      ...formPopupConfirm,
      message: message,
      title: "Thông báo",
    });
    setIsOpen(true);
  };
  const cancleClass = (currentClass) => {
    showLoader();
    authorizedAxiosinstance
      .delete(`${API_ROOT}users/cancelClassRegistration`, {
        params: {
          userId: currentUser,
          classId: currentClass._id,
        },
      })
      .then((res) => {
        handleTabClick(activeTab);
        if (res.status !== 200) {
          showNotification("Đang xảy ra lỗi vui lòng liên hệ quản trị viên");
        } else {
          showNotification("Huỷ đăng ký lớp học thành công");
        }
        hideLoader();
      });
  };
  const handleCancelClick = (currentClass) => {
    if (currentClass) {
      setCurrentClass(currentClass);
    }
    setIsConfirm(true);
    setFormPopupConfirm({
      ...formPopupConfirm,
      message: "Bạn có muốn huỷ đăng ký lớp học không?",
      title: "Xác nhận",
    });
    toggle();
  };
  const handleConfirm = async () => {
    // Xử lý sự kiện khi người dùng nhấn "Delete"
    cancleClass(currentClass);
    setIsOpen(false);
  };

  const togglePopup = (userInfo) => {
    setShowPopup(!showPopup);
    setSelectedUser(userInfo?._id);
  };

  return (
    <div>
      {showPopup && (
        <PtInfoPopUp
          show={showPopup}
          handleClose={() => togglePopup({})}
          title="My Pop-up"
          userInfo={selectedUser}
        />
      )}
      <ConfirmPopup
        isOpen={isOpen}
        toggle={toggle}
        onConfirm={handleConfirm}
        isConfirm={isConfirm}
        title={formPopupConfirm.title}
        message={formPopupConfirm.message}
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
                      onClick={() =>
                        togglePopup(session.schedule[0].instructor)
                      }
                      alt="trainer"
                      className="trainer-img"
                      style={{ cursor: "pointer" }}
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
                      onClick={() => handleCancelClick(session)}
                      disabled={
                        (new Date(session.schedule[0].day).getDate() ===
                          new Date().getDate() &&
                          new Date(session.schedule[0].day).getMonth() ===
                            new Date().getMonth() &&
                          Math.round(
                            session.schedule[0].start_time.split(":")[1]
                          ) > new Date().getMinutes()) ||
                        (new Date(session.schedule[0].day).getDate() ===
                          new Date().getDate() &&
                          new Date(session.schedule[0].day).getMonth() ===
                            new Date().getMonth() &&
                          Math.round(
                            session.schedule[0].start_time.split(":")[0]
                          ) < new Date().getHours()) ||
                        (new Date(session.schedule[0].day).getMonth() ===
                          new Date().getMonth() &&
                          new Date(session.schedule[0].day).getDate() <
                            new Date().getDate())
                      }
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
                            onClick={() => togglePopup(p)}
                            style={{ cursor: "pointer" }}
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
