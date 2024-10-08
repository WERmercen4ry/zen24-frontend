import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.scss";
import { Button } from "reactstrap";
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <h1 className="not-found-title">4<span className="text-primary">0</span>4</h1>
      <p className="not-found-message">
        Oops! Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Button className="btn" color="secondary" onClick={() => navigate(-1)}>
        Trở về
      </Button>
    </div>
  );
};

export default NotFound;
