import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import '../../../assets/scss/layout/user_page.scss';
import { useParams } from 'react-router-dom';
const NotificateDetail = () => {
    const { id } = useParams(); // Lấy id từ URL
    const notifications = [
        {
            id: 1,
            title: 'Lớp học sắp bắt đầu',
            message: 'Lớp học của Quý khách viên sẽ diễn ra sau 24 giờ nữa.',
            time: '17:55 - 05/09/2024',
        },
        {
            id: 2,
            title: 'Lớp học sắp bắt đầu',
            message: 'Lớp học của Quý khách viên sẽ diễn ra sau 12 giờ nữa.',
            time: '09:00 - 04/09/2024',
        },
    ];
    const notification = notifications.find((n) => n.id === parseInt(id));

    if (!notification) {

        return (<Container className="workout-history mt-2 card-content">
            <Row>
                <Col className="text-center">
                    <h2 className="history-title">Thông báo không tồn tại</h2>
                </Col>
            </Row>
            {/* Gói tập */}
        </Container>)
    }

    return (
        <Container className="workout-history mt-2 card-content">
            <Row>
                <Col className="text-center">
                    <h2 className="history-title">Chi tiết thông báo</h2>
                </Col>
            </Row>
            {/* Gói tập */}
            <div className="package-info pb-4">
                <div className="notification-detail">
                    <h2>{notification.title}</h2>
                    <p>{notification.message}</p>
                    <span>{notification.time}</span>
                </div>
            </div>
        </Container>
    );
};

export default NotificateDetail;