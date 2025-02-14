import $api from "@/http";

export default class Admin {
  static async users() {
    return $api
      .get(`admin/users`)
      .then((res) => res)
      .catch((err) => err);
  }

  static async approve(userId) {
    return $api
      .patch(`admin/user/approve/${userId}`)
      .then((res) => res)
      .catch((err) => err);
  }

  static async ban(userId) {
    return $api
      .patch(`admin/user/ban/${userId}`)
      .then((res) => res)
      .catch((err) => err);
  }

  static async delete(userId) {
    return $api
      .delete(`admin/user/delete/${userId}`)
      .then((res) => res)
      .catch((err) => err);
  }
}
