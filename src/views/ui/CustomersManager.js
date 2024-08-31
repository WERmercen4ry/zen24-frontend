import {
  Input,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Table,
  Row,
  Col,
  Button,
} from "reactstrap";
import user1 from "../../assets/images/users/user1.jpg";
import user2 from "../../assets/images/users/user2.jpg";
import user3 from "../../assets/images/users/user3.jpg";
import "../../assets/scss/layout/customersManager.scss";

const tableData = [
  {
    avatar: user1,
    name: "LÊ PHAN PHƯƠNG NGUYÊN",
    agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
    phoneNumber: "0909760255",
    accountType: "STUDENT",
    reserved: false,
    expirationDate: "25-11-2024",
    action: 2,
  },
  {
    avatar: user2,
    name: "LÊ PHAN PHƯƠNG UYÊN",
    agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
    phoneNumber: "0909760255",
    accountType: "STUDENT",
    reserved: false,
    expirationDate: "25-11-2024",
    action: 2,
  },
  {
    avatar: user3,
    name: "LÊ PHAN PHƯƠNG BẢO",
    agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
    phoneNumber: "0909760255",
    accountType: "STUDENT",
    reserved: false,
    expirationDate: "25-11-2024",
    action: 2,
  },
  {
    avatar: user3,
    name: "LÊ PHAN PHƯƠNG BẢO",
    agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
    phoneNumber: "0909760255",
    accountType: "STUDENT",
    reserved: false,
    expirationDate: "25-11-2024",
    action: 2,
  },
  {
    avatar: user3,
    name: "LÊ PHAN PHƯƠNG BẢO",
    agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
    phoneNumber: "0909760255",
    accountType: "STUDENT",
    reserved: false,
    expirationDate: "25-11-2024",
    action: 2,
  },
  {
    avatar: user3,
    name: "LÊ PHAN PHƯƠNG BẢO",
    agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
    phoneNumber: "0909760255",
    accountType: "STUDENT",
    reserved: false,
    expirationDate: "25-11-2024",
    action: 2,
  },
  {
    avatar: user3,
    name: "LÊ PHAN PHƯƠNG BẢO",
    agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
    phoneNumber: "0909760255",
    accountType: "STUDENT",
    reserved: false,
    expirationDate: "25-11-2024",
    action: 2,
  },
  {
    avatar: user3,
    name: "LÊ PHAN PHƯƠNG BẢO",
    agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
    phoneNumber: "0909760255",
    accountType: "STUDENT",
    reserved: false,
    expirationDate: "25-11-2024",
    action: 2,
  },
  {
    avatar: user3,
    name: "LÊ PHAN PHƯƠNG BẢO",
    agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
    phoneNumber: "0909760255",
    accountType: "STUDENT",
    reserved: false,
    expirationDate: "25-11-2024",
    action: 2,
  },
  {
    avatar: user3,
    name: "LÊ PHAN PHƯƠNG BẢO",
    agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
    phoneNumber: "0909760255",
    accountType: "STUDENT",
    reserved: false,
    expirationDate: "25-11-2024",
    action: 2,
  },
  {
    avatar: user3,
    name: "LÊ PHAN PHƯƠNG BẢO",
    agency: "1. FOURT PILATES- Số 9, Đường 10, KDT Hà Đô",
    phoneNumber: "0909760255",
    accountType: "STUDENT",
    reserved: false,
    expirationDate: "25-11-2024",
    action: 2,
  },
];

const CustomersManager = () => {
  return (
    <div>
      <Card>
        <Row className="mt-3">
          <Col>
            <Input
              id="exampleEmail"
              name="email"
              placeholder="Tìm kiếm họ tên và điện thoại"
              type="email"
              className="search-user"
            />
          </Col>
          <Col></Col>
          <Col></Col>
          <Col></Col>
        </Row>
        <CardBody>
          <div className="header-user">
            <div>
              <CardTitle tag="h5">
                <strong>Người dùng</strong>
              </CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                Chọn 0 bản ghi
              </CardSubtitle>
            </div>
            <div className="button-user">
              <Button className="btn" color="primary" size="md">
                + Thêm mới
              </Button>
              <Button className="btn" outline color="danger" size="md">
                Tài khoản gần đến giới hạn
              </Button>
              <Button className="btn" outline color="secondary" size="md">
                Quá ngày không tham gia
              </Button>
            </div>
          </div>

          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>
                  <Input type="checkbox" style={{ cursor: "pointer" }} />
                </th>
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Họ Tên
                  </p>
                </th>
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Chi Nhánh
                  </p>
                </th>

                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Số Điện Thoại
                  </p>
                </th>
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Loại Tài Khoản
                  </p>
                </th>
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Avatar
                  </p>
                </th>
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Bảo Lưu
                  </p>
                </th>
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Ngày Hết Hạn
                  </p>
                </th>
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Hành Động
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((tData, index) => (
                <tr key={index} className="border-top">
                  {/* <td>
                    <div className="d-flex align-items-center p-2">
                      <img
                        src={tdata.avatar}
                        className="rounded-circle"
                        alt="avatar"
                        width="45"
                        height="45"
                      />
                      <div className="ms-3">
                        <h6 className="mb-0">{tdata.name}</h6>
                        <span className="text-muted">{tdata.email}</span>
                      </div>
                    </div>
                  </td> */}
                  <td>
                    <Input type="checkbox" style={{ cursor: "pointer" }} />
                  </td>
                  <td>
                    <strong>{tData.name}</strong>
                  </td>
                  <td>
                    <strong>{tData.agency}</strong>
                  </td>
                  <td>
                    <strong>{tData.phoneNumber}</strong>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i
                        className="bi bi-person"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "1.2rem", // Kích thước vòng tròn
                          height: "1.2rem", // Kích thước vòng tròn
                          borderRadius: "50%", // Tạo hình tròn
                          backgroundColor: "#007bff", // Màu nền xanh
                          color: "white", // Màu biểu tượng trắng
                          fontSize: "1.2rem", // Kích thước biểu tượng
                          lineHeight: "1",
                          paddingRight: "1px",
                        }}
                      ></i>
                      <strong style={{ paddingLeft: "4px" }}>
                        {tData.accountType === "STUDENT"
                          ? "STUDENT"
                          : "TEACHER"}
                      </strong>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center p-2">
                      <img
                        src={tData.avatar}
                        className="rounded-circle"
                        alt="avatar"
                        width="45"
                        height="45"
                      />
                    </div>
                  </td>
                  <td>
                    {tData.reserved === false ? (
                      <span
                        style={{
                          padding: "1px",
                          paddingLeft: "4px",
                          paddingRight: "4px",
                          backgroundColor: "#4682B4",
                          color: "white", // Giúp văn bản nổi bật trên nền xanh
                          borderRadius: "20px",
                        }}
                      >
                        Chưa có trạng thái
                      </span>
                    ) : (
                      <span>Đã bảo lưu</span>
                    )}
                  </td>
                  <td>
                    <strong>{tData.expirationDate}</strong>
                  </td>
                  <td>
                    <i
                      className="bi bi-gift gift-hover"
                      style={{
                        fontSize: "1.5rem",
                        color: "black",
                        padding: "0.5rem",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <span className="action-num">1</span>
                    </i>
                  </td>
                  {/* <td>
                    {tData.status === "pending" ? (
                      <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                    ) : tData.status === "holt" ? (
                      <span className="p-2 bg-warning rounded-circle d-inline-block ms-3"></span>
                    ) : (
                      <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                    )}
                  </td>
                  <td>{tData.weeks}</td>
                  <td>{tData.budget}</td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default CustomersManager;
