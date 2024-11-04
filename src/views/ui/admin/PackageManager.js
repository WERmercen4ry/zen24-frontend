import { Card, CardBody, CardTitle, Table, Button } from "reactstrap";
import "../../../assets/scss/layout/customersManager.scss";
import { Link } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { API_ROOT } from "../../../utils/constant.js";
import authorizedAxiosinstance from "../../../utils/authorizedAxios.js";
import { LoaderContext } from "../../../layouts/loader/LoaderContext";
import { useToast } from "../../../layouts/admin/ToastContext";
import { TOAST_TYPES } from "../../../utils/constant";
import ConfirmPopup from "../../../layouts/admin/ConfirmPopup";

const PackageManager = () => {
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { showToast } = useToast();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPackage, setCurrentTPackage] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (page, limit) => {
    try {
      showLoader();

      const res = await authorizedAxiosinstance.get(
        `${API_ROOT}dashboards/packages`
      );

      if (res.status !== 200) {
        showToast("Thông báo", res.response?.data?.message, TOAST_TYPES.ERROR);
      } else {
        setData(res.data);
        setFilteredData(res.data);
        // setTotalPages(res.data.totalPages);
        // setTotalPayments(res.data.totalUsers);
      }

      hideLoader();
    } catch (error) {
      showToast(
        "Thông báo",
        "Có lỗi xảy ra, vui lòng thử lại.",
        TOAST_TYPES.ERROR
      );
      hideLoader();
    }
  };

  function formatCurrency(amount) {
    return amount.toLocaleString("en-US");
  }

  const togglePopup = (currentTimeTable) => {
    if (currentTimeTable && !isOpen) {
      setCurrentTPackage(currentTimeTable);
    }
    setIsOpen(!isOpen);
  };
  const handleConfirm = async () => {
    // Xử lý sự kiện khi người dùng nhấn "Delete"
    togglePopup();
    const res = await authorizedAxiosinstance.delete(
      `${API_ROOT}dashboards/deletePackage?packageId=${currentPackage._id}`
    );
    if (res.status === 200) {
      showToast("Thông báo", "Xoá lịch tập thành công!", TOAST_TYPES.SUCCESS);
      fetchData();
    }
  };

  return (
    <div>
      <ConfirmPopup
        isOpen={isOpen}
        toggle={togglePopup}
        onConfirm={handleConfirm}
        message={"Bạn có muốn thực hiện xoá gói tập này không?"}
      />
      <Card>
        <CardBody>
          <div className="header-user">
            <div>
              <CardTitle tag="h5">
                <strong>Danh sách gói</strong>
              </CardTitle>
            </div>
            <div className="button-user">
              <Link to={"/admin/create-packages"}>
                <Button className="btn" color="primary" size="md">
                  + Thêm mới
                </Button>
              </Link>
            </div>
          </div>
          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                {/* <th>
                  <Input type="checkbox" style={{ cursor: "pointer" }} />
                </th> */}
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Loại gói
                  </p>
                </th>
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Tên gói
                  </p>
                </th>

                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Giá tiền
                  </p>
                </th>
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Kiểu
                  </p>
                </th>
                <th>
                  <p className="text-muted" style={{ margin: "0px" }}>
                    Phân Loại
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((tData, index) => (
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
                    {/* <td>
                      <Input type="checkbox" style={{ cursor: "pointer" }} />
                    </td> */}
                    <td>
                      <strong>{tData.level}</strong>
                    </td>
                    <td>
                      <strong>{tData.name}</strong>
                    </td>
                    <td>
                      <strong>{formatCurrency(tData.price)}</strong>
                    </td>
                    <td>
                      <strong>{tData.standard}</strong>
                    </td>
                    <td>
                      <strong>{tData.type}</strong>
                    </td>
                    <td>
                      <Link
                        to="/admin/update-packages"
                        state={{ packageId: tData._id }}
                      >
                        <Button color="secondary m-auto" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </td>
                    <td>
                      <Button
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          borderColor: "red",
                        }}
                        className="m-auto custom-red-button"
                        size="sm"
                        onClick={() => togglePopup(tData)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <span></span>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default PackageManager;
