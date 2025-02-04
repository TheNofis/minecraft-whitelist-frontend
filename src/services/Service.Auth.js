import $api from "@/http";

export default class Auth {
  static async register({ username, email, password, ingamename }) {
    return $api
      .post(`user/register`, { username, email, password, ingamename })
      .then((res) => res)
      .catch((err) => err);
  }

  static async login({ identifier, password }) {
    return $api
      .post(`user/login`, {
        identifier,
        password,
      })
      .then((res) => res)
      .catch((err) => err);
  }

  static async emailVerify(emailCode) {
    return $api
      .patch("user/email-verify", { emailCode })
      .then((res) => res)
      .catch((err) => err);
  }

  static async sendEmail(email) {
    return $api
      .post(`user/send-email`, { email })
      .then((res) => res)
      .catch((err) => err);
  }

  static async verify() {
    return $api
      .get(`user/verify`)
      .then((res) => res)
      .catch((err) => err);
  }
}
