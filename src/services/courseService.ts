import API from "../config/axios";

export const fetchCourses = () => API.get("/course");

export const fetchCourseById = (id: string | number) => API.get(`/course/${id}`);
