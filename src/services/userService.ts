import API from "../config/axios";

export const createUser = (user) => {
  return API.post("/users", user);
};
export const getUserByEmail = (email) => {
  return API.get(`/users?email=${email}`);
};
export const updateUserFavorites = (userId, favorites) => {
  return API.put(`/users/${userId}`, { favorites });
};
export const getUserByUID = (uid) => {
  return API.get(`/users?uid=${uid}`);
};