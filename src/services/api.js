import axios from "axios";

const api = axios.create({
    baseURL: "https://api-6g8x.onrender.com",
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.config && err.config.baseURL === "https://api-6g8x.onrender.com") {
            err.config.baseURL = "http://localhost:3001";
            api.defaults.baseURL = "http://localhost:3001";
            return api(err.config);
        }
        return Promise.reject(err);
    }
);

export default api;