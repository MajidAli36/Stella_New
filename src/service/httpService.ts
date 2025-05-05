import http from "./httpCommon";

class httpService {
  getAll() {
    return http.get("/Auth/GetUsers");
  }

  get(id: any) {
    return http.get(`/Auth/Login/${id}`);
  }

  getobject(data: any) {
    return http.get(`/Auth/Login`, data);
  }


  create(data: any) {
    return http.post("/Auth/Login", data);
  }

  update(id: any , data: any) {
    return http.put(`/tutorials/${id}`, data);
  }

  delete(id: any) {
    return http.delete(`/tutorials/${id}`);
  }

  deleteAll() {
    return http.delete(`/tutorials`);
  }

  findByTitle(title: any) {
    return http.get(`/tutorials?title=${title}`);
  }
}

export default new httpService();