import $api from "@/http";

export default class Admin {
  static async users() {
    return $api
      .get(`admin/users`)
      .then((res) => res)
      .catch((err) => err);
  }

  static async action(userId, action) {
    return $api
      .patch(`admin/user/${userId}`, { action })
      .then((res) => res)
      .catch((err) => err);
  }
}
