
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
});

// const api = axios.create({
//     baseURL: "https://akhlak.backend.reliablekrishi.com/",
// });

export default api;

