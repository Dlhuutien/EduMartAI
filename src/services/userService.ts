import API from "../config/axios";

export const createUser = (user) => {
  return API.post("/users", user);
};
export const getUserByEmail = (email) => {
  return API.get(`/users?email=${email}`);
};