import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Button, Input } from "reactstrap";
import ConfirmPopup from "../../../layouts/user/ConfirmPopup";
import "../../../assets/scss/layout/user_page.scss";
import logo from "../../../assets/images/logos/ZenLogo2.png";
import PtInfoPopUp from "./PtInfoPopUp";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";

const BookingScreen = () => {
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [listPackageData, setListPackageData] = useState([]);
  const [listClass, setListClass] = useState([]);
  const [userId, setUserId] = useState(null);
  const [classId, setClassId] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");

  const [formSearch, setFormSearch] = useState({
    userId: "",
    type: "Pilate",
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

  const toggle = () => setIsOpen(!isOpen);

  const togglePopup = (userInfo) => {
    setShowPopup(!showPopup);
    setSelectedUser(userInfo?._id);
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
      fetchPackageForUser();
    }
    hideLoader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSearch]);

  const fetchPackageForUser = () => {
    authorizedAxiosinstance
      .get(
        `${API_ROOT}users/getUserRegisteredPackages?userId=${formSearch.userId}`
      )
      .then((res) => {
        if (res.status !== 200) {
          showNotification(res.response?.data?.message);
        } else {
          setListPackageData(res.data);
        }
        hideLoader();
      })
      .catch((error) => {
        showNotification("Có lỗi xảy ra, vui lòng thử lại.");
      });
  };

  const fetchClassForUser = () => {
    showLoader();
    authorizedAxiosinstance
      .post(`${API_ROOT}users/getClassesForUserPackages`, formSearch)
      .then((res) => {
        if (res.status !== 200) {
          showNotification(res.response?.data?.message);
        } else {
          setListClass(res.data?.suitableClasses);
        }
        hideLoader();
      })
      .catch((error) => {
        showNotification("Có lỗi xảy ra, vui lòng thử lại.");
      });
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

  const handleRegistClass = (classId) => {
    setClassId(classId);
    setIsConfirm(true);
    setFormPopupConfirm({
      ...formPopupConfirm,
      message: "Bạn có muốn đăng ký lớp học không?",
      title: "Xác nhận",
    });
    toggle();
  };

  const handleConfirm = async () => {
    showLoader();
    setFormRegisClass({
      ...formRegisClass,
      userId: formSearch.userId,
      classId: classId,
    });
    const res = await authorizedAxiosinstance.post(
      `${API_ROOT}users/registerUserForClass`,
      { ...formRegisClass, userId: formSearch.userId, classId: classId }
    );

    if (res.status === 200) {
      showNotification("Đăng ký lớp học thành công");
      fetchClassForUser();
    } else {
      showNotification(res.response.data.message);
    }
    hideLoader();
  };

  const showNotification = (message) => {
    setIsConfirm(false);
    setFormPopupConfirm({
      ...formPopupConfirm,
      message: message,
      title: "Thông báo",
    });
  };

  return (
    <Container className="workout-history mt-2 card-content">
      {/* Gói tập */}
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

      <div className="package-info pb-4 border-bottom">
        <h5>Gói tập</h5>
        {listPackageData && listPackageData.length > 0 ? (
          listPackageData.map((packageInfo, index) => (
            <div key={index} className="p-3 package-card child-content mb-1">
              <Row>
                <Col md="9" xs="8">
                  <h6>Gói tập của bạn</h6>
                  <p className="mb-1 text-muted">
                    Ngày hết hạn:{" "}
                    {new Date(packageInfo.end_date).toISOString().split("T")[0]}
                  </p>
                  <p className="mb-1 text-muted">
                    Số buổi tập:{" "}
                    {packageInfo.total_lessons - packageInfo.remaining_lessons}/
                    {packageInfo.total_lessons}
                  </p>
                  <p className="mb-1 text-muted">
                    Lớp: {packageInfo.package_id.type}
                  </p>
                  <p className="mb-1 text-muted">
                    Loại: {packageInfo.package_id.level}
                  </p>
                </Col>
                <Col md="3" xs="4" className=" align-items-center">
                  <div className="d-flex justify-content-center ">
                    <img
                      src={logo}
                      width="80"
                      alt="logo"
                      className="package-logo"
                    />
                  </div>
                  <div className="type-package mx-auto">
                    {packageInfo.package_id.name}
                  </div>
                </Col>
              </Row>
            </div>
          ))
        ) : (
          <span className="text-center">Bạn chưa đăng ký gói tập</span>
        )}
      </div>

      {/* Tabs */}
      <Row className="schedule-tabs mt-4">
        <Col xs="6" className="text-center">
          <Button
            className={
              formSearch.type === "Pilate" ? "active-tab" : "inactive-tab"
            }
            onClick={() => handleChangeType("Pilates")}
          >
            PILATES
          </Button>
        </Col>
        <Col xs="6" className="text-center">
          <Button
            className={
              formSearch.type === "Gym" ? "active-tab" : "inactive-tab"
            }
            onClick={() => handleChangeType("Gym")}
          >
            GYM
          </Button>
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
          value={formSearch.selectDate} // Đảm bảo date có định dạng đúng
          onChange={handleDateChange} // Cập nhật ngày khi thay đổi
        />
      </div>

      <div className="my-3 child-content">
        {listClass && listClass.length > 0 ? (
          listClass.map((class1, index) => (
            <Row
              key={index}
              className="workout-item mb-2 justify-content-center"
            >
              <Col
                xs="12"
                className="workout-header d-flex justify-content-between"
              >
                <div className="workout-time">
                  {class1.schedule[0].start_time} -{" "}
                  {class1.schedule[0].end_time}
                </div>
              </Col>
              <Row className="p-0 m-1">
                <Col xs="12" className="d-flex justify-content-between">
                  <div className="workout-time">{class1.type}</div>
                </Col>
                <Col xs="12" className="mt-1">
                  <Row>
                    <Col md="1" xs="2">
                      <img
                        onClick={() =>
                          togglePopup(class1.schedule[0].instructor)
                        }
                        src={class1.schedule[0].instructor.avatar}
                        alt="trainer"
                        className="trainer-img"
                        style={{ cursor: "pointer" }}
                      />
                    </Col>
                    <Col md="9" xs="5" className="workout-trainer">
                      <div>
                        PT: {class1.schedule[0].instructor.profile.name}
                      </div>
                    </Col>
                    <Col
                      md="2"
                      xs="5"
                      className="d-flex align-items-center justify-content-end"
                    >
                      <Button
                        color="primary"
                        size="lg"
                        className="status-btn"
                        onClick={() => handleRegistClass(class1._id)}
                        disabled={
                          class1.student_in_class.length ===
                            class1.max_members ||
                          class1.student_in_class.some(
                            (student) => student._id === userId
                          ) ||
                          (new Date(class1.schedule[0].day).getDate() ===
                            new Date().getDate() &&
                            new Date(class1.schedule[0].day).getMonth() ===
                              new Date().getMonth() &&
                            Math.round(
                              class1.schedule[0].start_time.split(":")[1]
                            ) > new Date().getMinutes()) ||
                          (new Date(class1.schedule[0].day).getDate() ===
                            new Date().getDate() &&
                            new Date(class1.schedule[0].day).getMonth() ===
                              new Date().getMonth() &&
                            Math.round(
                              class1.schedule[0].start_time.split(":")[0]
                            ) < new Date().getHours())
                        }
                      >
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
                      {class1.student_in_class.length > 0 && (
                        <div className="participants-icons">
                          {class1.student_in_class.map((p, i) => (
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
                        {class1.student_in_class.length}/{class1.max_members}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Row>
          ))
        ) : (
          <span className="text-center">Không có lịch tập</span>
        )}
      </div>
    </Container>
  );
};

export default BookingScreen;
