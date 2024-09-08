import '../../../assets/scss/layout/user_page.scss';

import React from 'react';
import { Container, Row, Col, Button, Badge } from 'reactstrap';
import user3 from "../../../assets/images/users/user3.jpg";

const WorkoutHistory = () => {
    // Dữ liệu mẫu tương ứng với lịch sử luyện tập
    const workoutData = [
        {
            time: '18:00 - 19:00',
            type: 'PILATES 1-4',
            trainer: 'HOLLY',
            trainerImg: user3,
            participants: [user3, user3, user3, user3],
            isCompleted: false,
            date: '6/9/2024',
            isFull: true,
            maxParticipants: 4,
            currentParticipants: 4,
        },
        {
            time: '09:00 - 10:00',
            type: 'PILATES 1-4',
            trainer: 'NGUYỄN HOÀNG MINH',
            trainerImg: user3,
            participants: [],
            date: '4/9/2024',
            isCompleted: true,
        },
        {
            time: '15:00 - 16:00',
            type: 'PILATES 1-4',
            trainer: 'QUÁCH KIM HÒA',
            trainerImg: user3,
            participants: [],
            date: '28/8/2024',
            isCompleted: true,
        },
        {
            time: '07:00 - 08:00',
            type: 'PILATES 1-4',
            trainer: 'SAM',
            trainerImg: user3,
            participants: [],
            date: '28/8/2024',
            isCompleted: true,
        },
        // Thêm các item khác nếu cần
    ];

    return (
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
                    <Button className="active-tab">Tất cả</Button>
                </Col>
                <Col xs="3" className="text-center px-2p">
                    <Button className="inactive-tab">Ngày</Button>
                </Col>
                <Col xs="3" className="text-center px-2p">
                    <Button className="inactive-tab">Tuần</Button>
                </Col>
                <Col xs="3" className="text-center px-2p">
                    <Button className="inactive-tab">Tháng</Button>
                </Col>
            </Row>

            {/* Danh sách các buổi tập */}
            {workoutData.map((workout, index) => (
                <Row key={index} className="workout-item mb-3 justify-content-center">
                    <Col xs="12" className="workout-header d-flex justify-content-between">
                        <div className="workout-time">{workout.time}</div>
                        <div className="workout-date">{workout.date}</div>
                    </Col>

                    {!workout.isCompleted ? (
                        <Row className='p-0 m-1'>
                            <Col xs="12" className="d-flex justify-content-between">
                                <div className="workout-time">{workout.type}</div>
                            </Col>
                            <Col xs="12" className='mt-1'>
                                <Row >
                                    <Col md="1" xs="2">
                                        <img src={workout.trainerImg} alt="trainer" className="trainer-img" />
                                    </Col>
                                    <Col md="9" xs="5" className="workout-trainer">
                                        <div >PT: {workout.trainer}</div>
                                    </Col>
                                    <Col md="2" xs="5" className="d-flex align-items-center justify-content-end">
                                        <Button color="danger" size="lg" className="status-btn">Hủy</Button>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs="12" className="mt-3 mb-1">
                                <Row>
                                    <Col xs="10" className="d-flex align-items-center justify-content-between">
                                        {workout.participants.length > 0 && (
                                            <div className="participants-icons">
                                                {workout.participants.map((p, i) => (
                                                    <img key={i} src={p} alt="participant" className="participant-img" />
                                                ))}
                                            </div>
                                        )}
                                    </Col>
                                    <Col xs="2" className='d-flex justify-content-end align-items-center'>
                                        <i className="bi bi-people-fill me-1"></i>
                                        <div className="workout-time">4/4</div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    ) : (
                        <Col xs="12" className="d-flex justify-content-between">
                            <div className="workout-time">{workout.type + " / PT: " + workout.trainer}</div>
                        </Col>
                    )}

                </Row>
            ))}
        </Container>
    );
};

export default WorkoutHistory;
