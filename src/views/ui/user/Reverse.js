import React from 'react';
import { Container, Row, Col, Button,  } from 'reactstrap';
import '../../../assets/scss/layout/user_page.scss';
import user3 from "../../../assets/images/users/user3.jpg";

const Reverse = () => {

    // Thông tin gói tập
    const packageInfo = {
        expiryDate: '9-12-2025',
        totalSessions: 144,
        attendedSessions: 74,
        classType: 'Pilates',
        level: '1-4',
        packageType: 'Gói thường',
        logo: user3
    };
    const packageInfoList = [{
        expiryDate: '9-12-2025',
        totalSessions: 144,
        attendedSessions: 74,
        classType: 'Pilates',
        level: '1-4',
        packageType: 'Gói thường',
        logo: user3
    }, {
        expiryDate: '9-12-2025',
        totalSessions: 144,
        attendedSessions: 74,
        classType: 'Pilates',
        level: '1-4',
        packageType: 'Gói thường',
        logo: user3
    }, {
        expiryDate: '9-12-2025',
        totalSessions: 144,
        attendedSessions: 74,
        classType: 'Pilates',
        level: '1-4',
        packageType: 'Gói thường',
        logo: user3
    }, {
        expiryDate: '9-12-2025',
        totalSessions: 144,
        attendedSessions: 74,
        classType: 'Pilates',
        level: '1-4',
        packageType: 'Gói thường',
        logo: user3
    },

    ];
    return (
        <Container className="workout-history mt-2 card-content">
            <Row>
                <Col className="text-center">
                    <h2 className="history-title">BẢO LƯU</h2>
                </Col>
            </Row>
            {/* Gói tập */}
            <div className="package-info pb-4 border-bottom">
                <h5>Gói tập</h5>
                <div className="p-3 package-card child-content">
                    <Row>
                        <Col xs="12">
                            <div className="d-flex justify-content-between height-25">
                                <h6>Gói tập của bạn</h6>
                                <p className='text-success'>Đang sử dụng</p>
                            </div>

                            <p className='mb-1 text-muted'>Ngày hết hạn: {packageInfo.expiryDate}</p>
                        </Col>
                        <Col xs="12" className="d-flex justify-content-center">
                            <Button className="btn-reverse mx-auto">Bảo lưu</Button>
                        </Col>
                    </Row>
                </div>
            </div>

            <div className="package-info mt-2 pb-4">
                <h5>Danh sách gói tập</h5>
                {packageInfoList.map((session, index) => (
                    <div key={index} className="p-3 mb-2 package-card child-content">
                        <Row className=''>
                            <Col xs="9">
                                <h6>Gói tập của bạn</h6>
                                <p className='mb-1 text-muted'>Ngày hết hạn: {session.expiryDate}</p>
                                <p className='mb-1 text-muted'>Số buổi tập: {session.attendedSessions}/{session.totalSessions}</p>
                                <p className='mb-1 text-muted'>Lớp: {session.classType}</p>
                                <p className='mb-1 text-muted'>Loại: {session.level}</p>
                            </Col>
                            <Col xs="3" className=" align-items-center">
                                <div className='d-flex justify-content-center '><img src={session.logo} width="80" alt="logo" className="package-logo" /></div>

                            </Col>
                        </Row>
                    </div>
                ))}

            </div>
        </Container>
    );
};

export default Reverse;
