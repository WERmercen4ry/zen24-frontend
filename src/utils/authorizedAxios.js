import axios from "axios";
import { handleLogoutAPI, handleRefreshTokenAPI } from "./handleApi";
import { toast } from "react-toastify";
// tạo ra một instance của axios
let authorizedAxiosinstance = axios.create();

// cấu hình thời gian timeout cho request
authorizedAxiosinstance.defaults.timeout = 1000000;

// cho phép tự động đính kèm cookie vào request
authorizedAxiosinstance.defaults.withCredentials = true;

// cấu hình interceptors cho request can thiệp vào giữa request trước khi gửi đi
authorizedAxiosinstance.interceptors.request.use(
  (config) => {
    // // Do something before request is sent
    // // lấy accessToken từ localStorage
    const accessToken = localStorage.getItem("accessToken");
    // // nếu tồn tại accessToken thì gán vào header Authorization
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

let refreshTokenpromise = null;
// Add a response interceptor can thiệp vào giữa response trả về
authorizedAxiosinstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response?.status === 403) {
      toast.error(error.response?.data?.message || error?.message);
    }

    // nếu response trả về lỗi thì hiển thị thông báo lỗi

    if (error.response?.status === 401) {
      handleLogoutAPI().then(() => {
        localStorage.removeItem("userinfo");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        //location.href = "/login";
      });
    }

    const originalRequest = error.config;
    if (error.response?.status === 410 && originalRequest) {
      if (!refreshTokenpromise) {
        const refreshToken = localStorage.getItem("refreshToken");

        refreshTokenpromise = handleRefreshTokenAPI(refreshToken)
          .then((res) => {
            const { accessToken } = res.data;
            // nếu response trả về thành công thì lưu lại accessToken và refreshToken mới
            localStorage.setItem("accessToken", accessToken);
          })
          .catch((_error) => {
            localStorage.removeItem("userinfo");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            //location.href = "/login";

            return Promise.reject(_error);
          })
          .finally(() => {
            refreshTokenpromise = null;
          });
      }

      return refreshTokenpromise.then(() => {
        // sau khi lưu lại accessToken và refreshToken mới thì gửi lại request ban đầu
        return authorizedAxiosinstance(originalRequest);
      });

      // lấy refreshToken từ localStorage
    }
  }
);

export default authorizedAxiosinstance;
