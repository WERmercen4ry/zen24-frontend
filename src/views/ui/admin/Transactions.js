import React from 'react';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import user3 from "../../../assets/images/users/user3.jpg";
const Transactions = () => {
    // Dữ liệu mẫu cho bảng
    const transactionData = [
        {
            user: "NGUYỄN MINH PHƯƠNG",
            method: "Momo",
            status: "Chờ duyệt",
            type: "Rút tiền",
            amount: "3.600.000 đ",
            image: user3
        },
        {
            user: "TRẦN PHẠM MINH HƯƠNG",
            method: "Momo",
            status: "Hoàn thành",
            type: "Rút tiền",
            amount: "400.000 đ",
            image: user3
        },
        {
            user: "NGUYỄN THỊ THANH TÂM",
            method: "Momo",
            status: "Huỷ",
            type: "Rút tiền",
            amount: "2.400.000 đ",
            image: user3
        },
        {
            user: "TRẦN THỤY SAO MAI",
            method: "Momo",
            status: "Chờ duyệt",
            type: "Rút tiền",
            amount: "400.000 đ",
            image: user3
        },
        {
            user: "TRẦN PHẠM MINH HƯƠNG",
            method: "Momo",
            status: "Hoàn thành",
            type: "Rút tiền",
            amount: "400.000 đ",
            image: user3
        }
    ];

    // Hàm để xác định lớp CSS của trạng thái
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

    return (
        <div className="transactions-content">
            <div className="transactions-header">
                <h4>Giao dịch</h4>
            </div>
            <Table borderless>
                <thead>
                    <tr>
                        <th className="text-muted">Người dùng</th>
                        <th className="text-muted">Phương Thức</th>
                        <th className="text-muted">Trạng Thái</th>
                        <th className="text-muted">Loại</th>
                        <th className="text-muted">Số Tiền</th>
                        <th className="text-muted">Hình Ảnh</th>
                    </tr>
                </thead>
                <tbody>
                    {transactionData.map((transaction, index) => (
                        <tr key={index} className="border-top">
                            <td>{transaction.user}</td>
                            <td><span className="label-method">{transaction.method}</span></td>
                            <td><span className={`label-status ${getStatusClass(transaction.status)}`}>{transaction.status}</span></td>
                            <td><span className="label-type">{transaction.type}</span></td>
                            <td>{transaction.amount}</td>
                            <td className="image-cell">
                                {transaction.image ? (
                                    <img src={transaction.image} alt="Hình ảnh" />
                                ) : (
                                    <div style={{ backgroundColor: '#eaeaea', width: '100%', height: '100%' }}></div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="transactions-footer">
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
                <div>1 - 5 of 18</div>
            </div>
        </div>
    );
};

export default Transactions;
