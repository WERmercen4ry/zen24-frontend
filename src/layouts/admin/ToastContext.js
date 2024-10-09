import React, { createContext, useState, useContext } from "react";
import { Toast, ToastBody } from "reactstrap";
import { TOAST_TYPES } from "../../utils/constant";
import {
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa"; // Thêm các icon

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: TOAST_TYPES.INFO,
  });

  const showToast = (title, message, type = TOAST_TYPES.INFO) => {

    setToast({
      isOpen: true,
      title,
      message,
      type,
    });

    setTimeout(() => {
      setToast({ ...toast, isOpen: false });
    }, 3000);
  };

  const hideToast = () => {
    setToast({
      ...toast,
      isOpen: false,
    });
  };

  // Icon dựa trên loại toast
  const renderIcon = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return <FaCheckCircle className="toast-icon" color="green" />;
      case TOAST_TYPES.INFO:
        return <FaInfoCircle className="toast-icon" color="blue" />;
      case TOAST_TYPES.WARNING:
        return <FaExclamationCircle className="toast-icon" color="orange" />;
      case TOAST_TYPES.ERROR:
        return <FaTimesCircle className="toast-icon" color="red" />;
      default:
        return null;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="custom-toast-container">
        <Toast isOpen={toast.isOpen} className={`toast-${toast.type}`}>
          <div className="toast-body-container">
            <div className="icon-container">{renderIcon()}</div>
            <div className="text-container">
              <ToastBody>{toast.message || "Có lỗi xảy ra, vui lòng thử lại."}</ToastBody>
            </div>
          </div>
        </Toast>
      </div>
    </ToastContext.Provider>
  );
};
