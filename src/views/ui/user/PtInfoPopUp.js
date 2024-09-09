import { Button } from "reactstrap";
import picture from "../../../assets/images/logos/ZenLogo2.png";
import "../../../assets/scss/layout/ptInfoPopUp.scss"; // Import CSS file

const PtInfoPopUp = ({ show, handleClose, title, children }) => {
  const ptInfo = {
    avt: picture,
    name: "Phạm Vũ Tuyên",
    cityName: "Thành phố Hồ Chí Minh",
    dayOfBirth: "14/12/1993",
    gender: "Nam",
    weight: 0,
    height: 160,
    targetTrain: "Giảm cân, Giảm mỡ",
    medicalHistory: "Không có",
  };

  if (!show) {
    return null; // Không hiển thị pop-up nếu không có show
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <img src={ptInfo.avt} alt="avt" className="popup-image" />
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
          <div className="popup-info">
            <i className="bi bi-postcard-heart icon-style"></i>
            <span>{ptInfo.medicalHistory}</span>
          </div>
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
