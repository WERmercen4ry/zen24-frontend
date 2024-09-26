import React, { useEffect, useState } from "react";
import { Table, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import authorizedAxiosinstance from "../../../utils/authorizedAxios";
import { API_ROOT } from "../../../utils/constant";
import "../../../assets/scss/layout/Transactions.scss";
const Transactions = () => {
  // State to hold transaction data
  const [transactionData, setTransactionData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5); // State to manage the selected limit
  const [totalPayments, setTotalPayments] = useState(0); // State to manage total number of payments

  // call API to fetch data from server whenever currentPage or limit changes
  useEffect(() => {
    fetchTransactions(currentPage, limit);
  }, [currentPage, limit]);

  const fetchTransactions = (page, limit) => {
    authorizedAxiosinstance
      .get(`${API_ROOT}/dashboards/getListPayments`, {
        params: {
          page: page,
          limit: limit,
        },
      })
      .then((res) => {
        // Set the transaction data from the API response
        setTransactionData(res.data.payments);
        setTotalPages(res.data.totalPages);
        setTotalPayments(res.data.totalpayments); // Set the total number of payments
      })
      .catch((error) => {
        console.error("Error fetching transaction data:", error);
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
            <th className="text-muted">Phương Thức</th>
            <th className="text-muted">Trạng Thái</th>
            <th className="text-muted">Số Tiền</th>
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
            <option value={5}>5</option>
            <option value={10}>20</option>
            <option value={20}>50</option>
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
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem active={index + 1 === currentPage} key={index}>
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
            <PaginationLink last onClick={() => handlePageChange(totalPages)} />
          </PaginationItem>
        </Pagination>
        <div>{`${start} - ${end} of ${totalPayments}`}</div>
      </div>
    </div>
  );
};

export default Transactions;
