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
export const getUserByUID = async (uid) => {
  const res = await API.get(`/users`);
  const users = res.data;
  const filtered = users.filter((u) => u.uid === uid);
  return { data: filtered };
};
