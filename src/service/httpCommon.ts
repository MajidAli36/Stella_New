import axios from "axios";

export default axios.create({
 baseURL: "http://waqarsts-001-site1.ktempurl.com/api",
  headers: {
    "Content-type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*"
  }
});