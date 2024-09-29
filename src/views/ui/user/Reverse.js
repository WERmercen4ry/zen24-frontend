import React, {useContext} from "react";
import { Container, Row, Col, Button } from "reactstrap";
import "../../../assets/scss/layout/user_page.scss";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { useEffect, useState } from "react";
import { API_ROOT } from "../../../utils/constant";
import ConfirmPopup from "../../../layouts/user/ConfirmPopup";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";

const Reverse = () => {
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const [isConfirm, setIsConfirm] = useState(true);
  const [expiredPackages, setExpiredPackages] = useState([]);
  const [otherPackages, setOtherPackage] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [formPopupConfirm, setFormPopupConfirm] = useState({
    message: "",
    title: "",
  });
  const toggle = () => setIsOpen(!isOpen);
  const currentUser = localStorage.getItem("userId");
  useEffect(() => {
    fetchTransactions();
  }, []);
  const showNotification = (message) => {
    setIsConfirm(false);
    setFormPopupConfirm({
      ...formPopupConfirm,
      message: message,
      title: "Thông báo",
    });
    setIsOpen(true);
  };
  const handleReverseClick = (currentPackage) => {
    if (currentPackage) {
      setCurrentPackage(currentPackage);
    }
    setIsConfirm(true);
    setFormPopupConfirm({
      ...formPopupConfirm,
      message: "Bạn có muốn bảo lưu gói này không?",
      title: "Xác nhận",
    });
    toggle();
  };
  const handleConfirm = async () => {
    showLoader();
    if (currentPackage.status === "Active") {
      const body = {
        userId: currentUser,
        RegisterPackageId: currentPackage._id,
        suspensionReason: "N/A",
      };
      const res = await authorizedAxiosinstance.post(
        `${API_ROOT}users/suspend-course`,
        body
      );
      if (res.status === 200) {
        // TODO: show toast
        fetchTransactions();
      } else {
      }
    } else if (currentPackage.status === "Suspended") {
      const res = await authorizedAxiosinstance.post(
        `${API_ROOT}users/resume-course?RegisterPackageId=${currentPackage._id}`
      );
      if (res.status === 200) {
        // TODO: show toast
        fetchTransactions();
        showNotification("Bảo lưu gói thành công");
      } else {
        showNotification(res.response.data.message);
      }
    }
    hideLoader();
  };
  const fetchTransactions = () => {
    authorizedAxiosinstance
      .get(`${API_ROOT}/users/getUserRegisteredPackages`, {
        params: {
          userId: currentUser,
          //   page: page,
          //   limit: limit,
        },
      })
      .then((res) => {
        // Set the transaction data from the API response
        console.log("res", res);
        const [expired, other] = separatePackagesByStatus(res.data);
        console.log("expiredPackages", expired);
        console.log("otherPackages", other);
        setOtherPackage(other);
        setExpiredPackages(expired);
      })
      .catch((error) => {
        console.error("Error fetching transaction data:", error);
      });
  };
  const separatePackagesByStatus = (data) => {
    const expiredPackages = [];
    const otherPackages = [];

    data.forEach((item) => {
      if (item.status === "Expired") {
        expiredPackages.push(item);
      } else {
        otherPackages.push(item);
      }
    });

    return [expiredPackages, otherPackages];
  };

  return (
    <Container className="workout-history mt-2 card-content">
      <Row>
      <ConfirmPopup
        isOpen={isOpen}
        toggle={toggle}
        onConfirm={handleConfirm}
        isConfirm={isConfirm}
        title={formPopupConfirm.title}
        message={formPopupConfirm.message}
      />
        <Col className="text-center">
          <h2 className="history-title">BẢO LƯU</h2>
        </Col>
      </Row>
      {/* Gói tập */}
      {otherPackages.map((session, index) => (
        <div className="package-info pb-4 border-bottom">
          <h5>Gói tập</h5>
          <div className="p-3 package-card child-content">
            <Row>
              <Col xs="12">
                <div className="d-flex justify-content-between height-25">
                  <h6>Gói tập của bạn: {session.package_id.name}</h6>
                  <p className="text-success">Đang sử dụng</p>
                </div>

                <p className="mb-1 text-muted">
                  Ngày hết hạn: {session.end_date.split("T")[0]}
                </p>
                <p className="mb-1 text-muted">trạng thái : {session.status}</p>
                <p className="mb-1 text-muted">
                  Số buổi tập: {session.remaining_lessons}/
                  {session.total_lessons}
                </p>
                <p className="mb-1 text-muted">
                  Lớp: {session.package_id.type}
                </p>
                <p className="mb-1 text-muted">
                  Loại: {session.package_id.level}
                </p>
              </Col>
              <Col xs="12" className="d-flex justify-content-center">
                <Button
                  className="btn-reverse mx-auto"
                  onClick={() => handleReverseClick(session)}
                >
                  {session.status != "Suspended" ? "Bảo lưu" : "Tiếp tục"}
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      ))}
      <div className="package-info mt-2 pb-4">
        <h5>Danh sách gói đã tập </h5>
        {expiredPackages.map((session, index) => (
          <div key={index} className="p-3 mb-2 package-card child-content">
            <Row className="">
              <Col xs="9">
                <h6>Gói tập của bạn: {session.package_id.name}</h6>
                <p className="mb-1 text-muted">
                  Ngày hết hạn: {session.end_date.split("T")[0]}
                </p>
                <p className="mb-1 text-muted">trạng thái : {session.status}</p>

                <p className="mb-1 text-muted">
                  Số buổi tập: {session.remaining_lessons}/
                  {session.total_lessons}
                </p>
                <p className="mb-1 text-muted">
                  Lớp: {session.package_id.type}
                </p>
                <p className="mb-1 text-muted">
                  Loại: {session.package_id.level}
                </p>
              </Col>
              {/* <Col xs="3" className=" align-items-center">
                <div className="d-flex justify-content-center ">
                  <img
                    src={session.logo}
                    width="80"
                    alt="logo"
                    className="package-logo"
                  />
                </div>
              </Col> */}
            </Row>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Reverse;
