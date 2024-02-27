import axios from "axios";

const instance = axios.create();

if (import.meta.env.MODE === "development") {
  instance.defaults.baseURL = "http://localhost:8000";
  instance.defaults.withCredentials = true;
}

export { instance as axios };
