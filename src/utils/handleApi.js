import authorizedAxiosinstance from "./authorizedAxios";

export const handleLogoutAPI = async () => {
  return await authorizedAxiosinstance.delete(`http://localhost:8017/v1/users/logout`);
};

export const handleRefreshTokenAPI = async (refreshToken) => {
  return await authorizedAxiosinstance.put(
    `http://localhost:8017/v1/users/refresh_token`,{refreshToken}
  );
};