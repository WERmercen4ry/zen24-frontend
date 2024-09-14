import { Table, Button, Pagination, PaginationItem, PaginationLink, Row, Col } from 'reactstrap';
import { Link } from "react-router-dom";
import ConfirmPopup from '../../../layouts/admin/ConfirmPopup';
import React, { useState } from 'react';
const Timetables = () => {
  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  const handleConfirm = () => {
    // Xử lý sự kiện khi người dùng nhấn "Delete"
    console.log("Item deleted");
    togglePopup();
  };
    return (
        <Row>
          <ConfirmPopup isOpen={isOpen} toggle={togglePopup} onConfirm={handleConfirm} />
            <Col>
                <div className="timetable-content">
                    <div className="timetable-header">
                        <h4>Thời Khóa Biểu</h4>
                        <Link to={'/admin/timetable'}>
                            <Button color="primary" className='m-auto'>

                                + Thêm mới</Button>
                        </Link>

                    </div>
                    <Table  borderless>
                        <thead>
                            <tr>
                                <th className="text-muted">Trainer</th>
                                <th className="text-muted">Chi nhánh</th>
                                <th className="text-muted">Tổng số học viên</th>
                                <th className="text-muted">Số học viên</th>
                                <th className="text-muted">Loại</th>
                                <th className="text-muted">Bắt đầu</th>
                                <th className="text-muted">Kết thúc</th>
                                <th className="text-muted">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-top">
                                <td>GWEN</td>
                                <td>FOURT PILATES - SG, S6 8, Đường 10, KDT HA ĐB</td>
                                <td>1</td>
                                <td>1</td>
                                <td>PILATES</td>
                                <td>26-08-2024 19:20</td>
                                <td>26-08-2024 20:20</td>
                                <td>
                                    <Button color="secondary m-auto" size="sm">Edit</Button>{' '}
                                    <Button color="danger m-auto" size="sm" onClick={togglePopup}>Delete</Button>
                                </td>
                            </tr>
                            {/* Các dòng dữ liệu khác có thể được map từ một mảng dữ liệu */}
                        </tbody>
                    </Table>
                    <div className="timetable-footer">
                        <div>Các mục trên mỗi trang: 5</div>
                        <Pagination>
                            <PaginationItem>
                                <PaginationLink first href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink previous href="#" />
                            </PaginationItem>
                            <PaginationItem active>
                                <PaginationLink href="#">
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink next href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink last href="#" />
                            </PaginationItem>
                        </Pagination>
                        <div>1 - 5 of 1608</div>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default Timetables;
