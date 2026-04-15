import axios from "axios";

export const http = axios.create({
  proxy: false,
  timeout: 30000,
});
