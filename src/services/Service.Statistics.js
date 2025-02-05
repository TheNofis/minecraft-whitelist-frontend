import $api from "@/http";

export default class User {
  static async server() {
    return $api
      .get("statistics/server")
      .then((res) => res)
      .catch((err) => err);
  }
}
