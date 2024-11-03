import React, { useEffect, useState, useContext } from "react";
import {
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
} from "reactstrap";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";
import { useToast } from "../../../layouts/admin/ToastContext";
import { TOAST_TYPES } from "../../../utils/constant";
import Location from "./Location";
import ConfirmPopup from "../../../layouts/admin/ConfirmPopup";
const Locations = () => {
  // State to hold transaction data
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { showToast } = useToast();
  const [listLocationData, setListLocationData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5); // State to manage the selected limit
  // eslint-disable-next-line
  const [totalPayments, setTotalPayments] = useState(0); // State to manage total number of payments
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [location, setLocation] = useState();
  // call API to fetch data from server whenever currentPage or limit changes
  useEffect(() => {
    fetchLocations(currentPage, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit]);
  const handleUpdate = () => {
    showToast(
      "Thông báo",
      isEdit ? "Cập nhập chi nhánh thành công" : "Tạo mới chi nhánh thành công",
      TOAST_TYPES.SUCCESS
    );
    fetchLocations();
  };
  const clickOpenUpdate = (edit, location) => {
    setIsEdit(edit);
    if (edit) {
      setLocation(location);
    }
    toggleModal();
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const togglePopupDelete = (location) => {
    if (location && !isOpen) {
      setLocation(location);
    }
    setIsOpen(!isOpen);
  };
  const handleConfirmDelete = async () => {
    // Xử lý sự kiện khi người dùng nhấn "Delete"
    togglePopupDelete();
    const res = await authorizedAxiosinstance.delete(
      `${API_ROOT}dashboards/deleteLocation?locationId=${location._id}`
    );
    if (res.status === 200) {
      showToast(
        "Thông báo",
        "Xoá lịch chi nhánh thành công!",
        TOAST_TYPES.SUCCESS
      );
      fetchLocations();
    }
  };
  const fetchLocations = (page, limit) => {
    showLoader();
    authorizedAxiosinstance
      .get(`${API_ROOT}dashboards/getListLocations`, {
        params: {
          page: page,
          limit: limit,
        },
      })
      .then((res) => {
        if (res.status !== 200) {
          showToast(
            "Thông báo",
            res.response?.data?.message,
            TOAST_TYPES.ERROR
          );
        } else {
          setListLocationData(res.data);
        }
        hideLoader();
      })
      .catch((error) => {
        hideLoader();
        showToast(
          "Thông báo",
          "Có lỗi xảy ra, vui lòng thử lại.",
          TOAST_TYPES.ERROR
        );
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page when limit changes
  };

  // Calculate the starting and ending positions
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalPayments);

  return (
    <div className="transactions-content">
      <Location
        isOpen={isModalOpen}
        toggle={toggleModal}
        onDone={handleUpdate}
        isEdit={isEdit}
        locationData={location}
      />
      <ConfirmPopup
        isOpen={isOpen}
        toggle={togglePopupDelete}
        onConfirm={handleConfirmDelete}
        message={"Bạn có muốn thực hiện xoá chi nhánh này không?"}
      />
      <div className="transactions-header">
        <h4>Chi nhánh</h4>
        <Button
          className="btn my-auto"
          color="primary"
          size="md"
          onClick={() => clickOpenUpdate(false, null)}
        >
          + Thêm mới
        </Button>
      </div>
      <Table responsive borderless>
        <thead>
          <tr>
            <th className="text-muted">Tên chi nhánh</th>
            <th className="text-muted">Địa chỉ</th>
            <th className="text-muted">Số điện thoại</th>
            <th className="text-muted">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {listLocationData.map((location, index) => (
            <tr key={index} className="border-top align-middle">
              <td className="align-middle">{location.name}</td>
              <td className="align-middle">{location.address}</td>
              <td className="align-middle">{location.phone}</td>
              <td className="align-middle">
                <Button
                  color="secondary m-auto"
                  size="sm"
                  onClick={() => clickOpenUpdate(true, location)}
                >
                  Edit
                </Button>{" "}
                <Button
                  color="danger m-auto"
                  size="sm"
                  onClick={() => togglePopupDelete(location)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="transactions-footer">
        <div className="pagination-container">
          Các mục trên mỗi trang:
          <select
            className="pagination-select"
            value={limit}
            onChange={handleLimitChange}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
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
                <PaginationItem active={index + 1 === currentPage} key={index}>
                  <PaginationLink onClick={() => handlePageChange(index + 1)}>
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
            <PaginationLink last onClick={() => handlePageChange(totalPages)} />
          </PaginationItem>
        </Pagination>
        <div>{`${start} - ${end} of ${totalPayments}`}</div>
      </div>
    </div>
  );
};

export default Locations;
