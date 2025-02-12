import $api from "@/http";

export default class User {
  static async profile() {
    return $api
      .get(`user/profile`)
      .then((res) => res)
      .catch((err) => err);
  }

  static async changeskin(skin) {
    return $api
      .patch(`user/changeskin`, { skin })
      .then((res) => res)
      .catch((err) => err);
  }
}
