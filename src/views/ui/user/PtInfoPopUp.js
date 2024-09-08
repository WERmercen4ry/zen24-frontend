import { Container, Row, Col, Button, Badge } from "reactstrap";
import picture from "../../../assets/images/logos/ZenLogo2.png";

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
    return null; // Nếu không có show thì không hiển thị pop-up
  }

  return (
    <div style={popupStyles}>
      <div style={popupContentStyles}>
        <div style={{ marginBottom: "50px" }}>
          <div>
            <img
              src={ptInfo.avt}
              alt="avt"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "20px",
                marginBottom: "20px",
              }}
            ></img>
          </div>
          <div>
            <div>
              <div style={{ textAlign: "left", padding: "5px" }}>
                <strong style={{ fontSize: "20px" }}>{ptInfo.name}</strong>
              </div>
            </div>
            <div>
              <div style={{ textAlign: "left", padding: "5px" }}>
                <i class="bi bi-geo-alt-fill" style={iconStyle}></i>
                <span>{ptInfo.cityName}</span>
              </div>
            </div>
            <div>
              <div style={{ textAlign: "left", padding: "5px" }}>
                <i class="bi bi-calendar" style={iconStyle}></i>
                <span>{ptInfo.dayOfBirth}</span>
              </div>
            </div>
            <div>
              <div style={{ textAlign: "left", padding: "5px" }}>
                <i class="bi bi-gender-female" style={iconStyle}></i>
                <span>{ptInfo.gender}</span>
              </div>
            </div>
            <div>
              <div style={{ textAlign: "left", padding: "5px" }}>
                <i class="bi bi-speedometer" style={iconStyle}></i>
                <span>{ptInfo.weight} kg</span>
              </div>
            </div>
            <div>
              <div style={{ textAlign: "left", padding: "5px" }}>
                <i class="bi bi-rulers" style={iconStyle}></i>
                <span>{ptInfo.height} cm</span>
              </div>
            </div>
            <div>
              <div style={{ textAlign: "left", padding: "5px" }}>
                <i class="bi bi-bullseye" style={iconStyle}></i>
                <span>{ptInfo.targetTrain}</span>
              </div>
            </div>
            <div>
              <div style={{ textAlign: "left", padding: "5px" }}>
                <i class="bi bi-postcard-heart" style={iconStyle}></i>
                <span>{ptInfo.medicalHistory}</span>
              </div>
            </div>
          </div>
        </div>
        <Button
          color="primary"
          size="lg"
          className="status-btn"
          onClick={handleClose}
        >
          Đóng
        </Button>
      </div>
    </div>
  );
};

const popupStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const popupContentStyles = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
  width: "20vw",
};

const iconStyle = {
  fontSize: "20px",
  color: "#aa8a4f",
  padding: "10px",
  fontWeight: "900",
};

export default PtInfoPopUp;
