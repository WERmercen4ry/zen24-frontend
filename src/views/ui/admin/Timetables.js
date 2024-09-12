import {
  Table,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Col,
} from "reactstrap";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";
import TimetablePopup from "./Timetable";

const Timetables = () => {
  const [ClassesData, setClassesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5); // State to manage the selected limit
  const [totalPayments, setTotalPayments] = useState(0); // State to manage total number of payments
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // Quản lý trạng thái "add" hoặc "edit"
  const [currentTimeTable, setCurrentTimeTable] = useState(null);
  useEffect(() => {
    fetchClasses(currentPage, limit);
  }, [currentPage, limit]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const fetchClasses = (page, limit) => {
    authorizedAxiosinstance
      .get(`${API_ROOT}/dashboards/getClassList`, {
        params: {
          page: page,
          limit: limit,
        },
      })
      .then((res) => {
        console.log(res.data.classes);
        // Set the transaction data from the API response
        setClassesData(res.data.classes);
        setTotalPages(res.data.totalPages);
        setTotalPayments(res.data.totalClasses); // Set the total number of payments
      })
      .catch((error) => {
        console.error("Error fetching transaction data:", error);
      });
  };
  const openAddNew = () => {
    setIsEdit(false); // Mở popup ở trạng thái "add"
    setCurrentTimeTable(null); // Không có dữ liệu lớp học khi thêm mới
    toggleModal();
  };
  const openEdit = (classData) => {
    setIsEdit(true); // Mở popup ở trạng thái "edit"
    setCurrentTimeTable(classData); // Truyền dữ liệu lớp học cần chỉnh sửa
    toggleModal();
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page when limit changes
  };
  const handleFormatTime = (Date, house) => {
    const formatDate = Date.split("T")[0];
    console.log(Date);
    console.log(house);
    // return `11111111`;
    return `${formatDate} ${house}`;
  };
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalPayments);

  return (
    <div>
      <TimetablePopup
        isOpen={isModalOpen}
        toggle={toggleModal}
        isEdit={isEdit}
        timetable={currentTimeTable}
      />
      <Row>
        <Col>
          <div className="timetable-content">
            <div className="timetable-header">
              <h4>Thời Khóa Biểu</h4>
              <Button
                color="primary"
                className="my-auto me-0"
                onClick={openAddNew}
              >
                + Thêm mới
              </Button>
            </div>
            <Table borderless>
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
                {ClassesData.map((Classes, index) => (
                  <tr className="border-top">
                    <td>{Classes.schedule[0].instructor.profile.name}</td>
                    <td>
                      {Classes.schedule[0].location.name +
                        Classes.schedule[0].location.address}
                    </td>
                    <td>{Classes.max_members}</td>
                    <td>{Classes.student_in_class.length}</td>
                    <td>{Classes.type}</td>
                    <td>
                      {handleFormatTime(
                        Classes.schedule[0].day,
                        Classes.schedule[0].start_time
                      )}
                    </td>
                    <td>
                      {handleFormatTime(
                        Classes.schedule[0].day,
                        Classes.schedule[0].end_time
                      )}
                    </td>
                    <td>
                      <Button color="secondary m-auto" size="sm" onClick={() => openEdit(Classes)}>
                        Edit
                      </Button>{" "}
                      <Button color="danger m-auto" size="sm">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {/* <div className="timetable-footer">
            <div>Các mục trên mỗi trang: 5</div>
            <Pagination>
              <PaginationItem>
                <PaginationLink first href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink previous href="#" />
              </PaginationItem>
              <PaginationItem active>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink next href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink last href="#" />
              </PaginationItem>
            </Pagination>
            <div>1 - 5 of 1608</div>
          </div> */}
            <div className="timetable-footer">
              <div className="pagination-container">
                Các mục trên mỗi trang:
                <select
                  className="pagination-select"
                  value={limit}
                  onChange={handleLimitChange}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <Pagination>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink first onClick={() => handlePageChange(1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink
                    previous
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem
                    active={index + 1 === currentPage}
                    key={index}
                  >
                    <PaginationLink onClick={() => handlePageChange(index + 1)}>
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink
                    next
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </PaginationItem>
                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink
                    last
                    onClick={() => handlePageChange(totalPages)}
                  />
                </PaginationItem>
              </Pagination>
              <div>{`${start} - ${end} of ${totalPayments}`}</div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Timetables;
