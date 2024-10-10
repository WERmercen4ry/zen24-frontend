import React, { useEffect, useState, useContext } from "react";
import { Table, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";
import { useToast } from "../../../layouts/admin/ToastContext";
import { TOAST_TYPES } from "../../../utils/constant";
import "../../../assets/scss/layout/Transactions.scss";
const Transactions = () => {
  // State to hold transaction data
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { showToast } = useToast();
  const [transactionData, setTransactionData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5); // State to manage the selected limit
  const [totalPayments, setTotalPayments] = useState(0); // State to manage total number of payments

  // call API to fetch data from server whenever currentPage or limit changes
  useEffect(() => {
    fetchTransactions(currentPage, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit]);

  const fetchTransactions = (page, limit) => {
    showLoader();
    authorizedAxiosinstance
      .get(`${API_ROOT}dashboards/getListPayments`, {
        params: {
          page: page,
          limit: limit,
        },
      })
      .then((res) => {
        // Set the transaction data from the API response
        if (res.status !== 200) {
          showToast(
            "Thông báo",
            res.response?.data?.message,
            TOAST_TYPES.ERROR
          );
        } else {
          setTransactionData(res.data.payments);
          setTotalPages(res.data.totalPages);
          setTotalPayments(res.data.totalpayments);
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

  // Function to determine CSS class for status
  const getStatusClass = (status) => {
    switch (status) {
      case "Chờ duyệt":
        return "pending";
      case "Hoàn thành":
        return "completed";
      case "Huỷ":
        return "cancelled";
      default:
        return "";
    }
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
      <div className="transactions-header">
        <h4>Giao dịch</h4>
      </div>
      <Table responsive borderless>
        <thead>
          <tr>
            <th className="text-muted">Người dùng</th>
            <th className="text-muted">Phương Thức Thanh Toán</th>
            <th className="text-muted">Trạng Thái</th>
            <th className="text-muted">Số Tiền</th>
            <th className="text-muted">Ngày Thanh Toán</th>
          </tr>
        </thead>
        <tbody>
          {transactionData.map((transaction, index) => (
            <tr key={index} className="border-top">
              <td>{transaction.student_id.profile.name}</td>
              <td>
                <span className="label-method">{transaction.method}</span>
              </td>
              <td>
                <span
                  className={`label-status ${getStatusClass(
                    transaction.status
                  )}`}
                >
                  {transaction.status}
                </span>
              </td>
              <td>{transaction.amount}</td>
              <td>
                {transaction.payment_date ? (
                  <span>{transaction.payment_date.split("T")[0]}</span>
                ) : (
                  <span></span>
                )}
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

export default Transactions;
