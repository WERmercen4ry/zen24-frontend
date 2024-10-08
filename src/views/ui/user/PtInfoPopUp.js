import { Button } from "reactstrap";
import picture from "../../../assets/images/logos/ZenLogo2.png";
import "../../../assets/scss/layout/ptInfoPopUp.scss"; // Import CSS file
import React, { useState, useEffect } from "react";
import { API_ROOT } from "../../../utils/constant";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";

const PtInfoPopUp = ({ show, handleClose, title, children, userInfo }) => {
  const [ptInfo, setPtInfo] = useState({
    avt: picture,
    name: "Phạm Vũ Tuyên",
    cityName: "Thành phố Hồ Chí Minh",
    dayOfBirth: "14/12/1993",
    gender: "Nam",
    weight: 0,
    height: 160,
    targetTrain: "Giảm cân, Giảm mỡ",
    medicalHistory: "Không có",
  });

  useEffect(() => {
    fetchDataUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDataUser = () => {
    authorizedAxiosinstance
      .get(`${API_ROOT}users/getUserById?userId=${userInfo}`)
      .then((res) => {
        if (res && res.data && res.data.profile) {
          setPtInfo({
            avt: res.data.avatar,
            name: res.data.profile.name,
            cityName: res.data.profile.address,
            dayOfBirth:
              res.data.profile.date_of_birth !== ""
                ? res.data.profile.date_of_birth.split("T")[0]
                : "",
            gender: res.data.profile.sex === "male" ? "Nam" : "Nữ",
            weight: res.data.profile.weight,
            height: res.data.profile.height,
            targetTrain: res.data.profile.training_goals,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching users data:", error);
        throw error;
      });
  };

  if (!show) {
    return null; // Không hiển thị pop-up nếu không có show
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <div className="div-image">
            <img src={ptInfo.avt} alt="avt" className="popup-image" />
          </div>
          <strong className="popup-name">{ptInfo.name}</strong>
        </div>
        <div className="popup-body">
          <div className="popup-info">
            <i className="bi bi-geo-alt-fill icon-style"></i>
            <span>{ptInfo.cityName}</span>
          </div>
          <div className="popup-info">
            <i className="bi bi-calendar icon-style"></i>
            <span>{ptInfo.dayOfBirth}</span>
          </div>
          <div className="popup-info">
            <i className="bi bi-gender-female icon-style"></i>
            <span>{ptInfo.gender}</span>
          </div>
          <div className="popup-info">
            <i className="bi bi-speedometer icon-style"></i>
            <span>{ptInfo.weight} kg</span>
          </div>
          <div className="popup-info">
            <i className="bi bi-rulers icon-style"></i>
            <span>{ptInfo.height} cm</span>
          </div>
          <div className="popup-info">
            <i className="bi bi-bullseye icon-style"></i>
            <span>{ptInfo.targetTrain}</span>
          </div>
          {/* <div className="popup-info">
            <i className="bi bi-postcard-heart icon-style"></i>
            <span>{ptInfo.medicalHistory}</span>
          </div> */}
        </div>
        <Button
          color="primary"
          size="lg"
          className="popup-close-btn"
          onClick={handleClose}
        >
          Đóng
        </Button>
      </div>
    </div>
  );
};

export default PtInfoPopUp;
