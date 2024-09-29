import React from "react";
import { ListGroup, ListGroupItem, Container, Row, Col } from "reactstrap";
import {
  BsPerson,
  BsArchive,
  BsShare,
  BsShield,
  BsPhone,
  BsKey,
  BsBoxArrowRight,
} from "react-icons/bs"; // Bootstrap icons

const Policy = () => {
  return (
    <Container className="workout-history mt-2 card-content">
      <Row>
        <Col className="text-center mt-2">
          <h2 className="history-title">Chính sách</h2>
        </Col>
        <div className="package-info pb-4 border-bottom">
          <h5>Chi tiết</h5>
          <div className="p-3 package-card child-content">
            Chính sách của hệ thống
          </div>
        </div>
      </Row>
    </Container>
  );
};

export default Policy;