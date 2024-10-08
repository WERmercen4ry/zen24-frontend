import {
  Table,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Col,
} from "reactstrap";
import React, { useEffect, useState, useContext } from "react";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";
import TimetablePopup from "./Timetable";
import ConfirmPopup from "../../../layouts/admin/ConfirmPopup";
import TimetablePopupEdit from "./TimetableEdit";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";
import { useToast } from "../../../layouts/admin/ToastContext";
import { TOAST_TYPES } from "../../../utils/constant";

const Timetables = () => {
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = (currentTimeTable) => {
    if (currentTimeTable && !isOpen) {
      setCurrentTimeTable(currentTimeTable);
    }
    setIsOpen(!isOpen);
  };
  const handleConfirm = async () => {
    // Xử lý sự kiện khi người dùng nhấn "Delete"
    togglePopup();
    const res = await authorizedAxiosinstance.delete(
      `${API_ROOT}dashboards/deleteClasses?classId=${currentTimeTable._id}`
    );
    if (res.status === 200) {
      showToast("Thông báo", "Xoá lịch tập thành công!", TOAST_TYPES.SUCCESS);
      fetchClasses(currentPage, limit);
    }
  };
  const [ClassesData, setClassesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5); // State to manage the selected limit
  const [totalPayments, setTotalPayments] = useState(0); // State to manage total number of payments
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setisModalOpenEdit] = useState(false);

  const [currentTimeTable, setCurrentTimeTable] = useState(null);
  useEffect(() => {
    fetchClasses(currentPage, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleModalEdit = () => setisModalOpenEdit(!isModalOpenEdit);

  const fetchClasses = (page, limit) => {
    showLoader();
    authorizedAxiosinstance
      .get(`${API_ROOT}dashboards/getClassList`, {
        params: {
          page: page,
          limit: limit,
        },
      })
      .then((res) => {
        // Set the transaction data from the API response
        setClassesData(res.data.classes);
        setTotalPages(res.data.totalPages);
        setTotalPayments(res.data.totalClasses); // Set the total number of payments
        hideLoader();
      })
      .catch((error) => {
        hideLoader();
        console.error("Error fetching transaction data:", error);
      });
  };
  const handleCreate = () => {
    fetchClasses(currentPage, limit);
  };
  const openAddNew = () => {
    setCurrentTimeTable(null); // Không có dữ liệu lớp học khi thêm mới
    toggleModal();
  };
  const openEdit = (classData) => {
    setCurrentTimeTable(classData); // Truyền dữ liệu lớp học cần chỉnh sửa
    toggleModalEdit();
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
        timetable={currentTimeTable}
        onCreateDone={handleCreate}
      />
      <TimetablePopupEdit
        isOpen={isModalOpenEdit}
        toggle={toggleModalEdit}
        timetable={currentTimeTable}
        onEditDone={handleCreate}
      />
      <Row>
        <ConfirmPopup
          isOpen={isOpen}
          toggle={togglePopup}
          onConfirm={handleConfirm}
          message={"Bạn có muốn thực hiện xoá lịch tập này không?"}
        />
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
            <Table responsive borderless>
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
                      <Button
                        color="secondary m-auto"
                        size="sm"
                        onClick={() => openEdit(Classes)}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        color="danger m-auto"
                        size="sm"
                        onClick={() => togglePopup(Classes)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

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
                {[...Array(totalPages)].map((_, index) => {
                  // Xác định trang đầu và trang cuối để hiển thị trong khoảng 5 trang
                  let startPage = Math.max(1, currentPage - 2);
                  let endPage = Math.min(totalPages, currentPage + 2);

                  // Điều chỉnh khi ở gần đầu hoặc cuối danh sách trang
                  if (currentPage <= 3) {
                    startPage = 1;
                    endPage = Math.min(totalPages, 5);
                  } else if (currentPage >= totalPages - 2) {
                    startPage = Math.max(1, totalPages - 4);
                    endPage = totalPages;
                  }

                  // Chỉ render các PaginationItem trong khoảng từ startPage đến endPage
                  if (index + 1 >= startPage && index + 1 <= endPage) {
                    return (
                      <PaginationItem
                        active={index + 1 === currentPage}
                        key={index}
                      >
                        <PaginationLink
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null; // Không hiển thị các trang ngoài khoảng startPage và endPage
                })}
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
