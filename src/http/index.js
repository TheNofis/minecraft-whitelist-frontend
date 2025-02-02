const API_URL = process.env.API_URL || "https://24dv.ddns.me/api/user/";
import { getCookie } from "cookies-next";

export default class $api {
  static async post(url, body) {
    return await (
      await fetch(API_URL + url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Authorization: getCookie("Authorization"),
          "Content-Type": "application/json",
        },
      })
    ).json();
  }
  static async get(url) {
    return await (
      await fetch(API_URL + url, {
        headers: {
          Authorization: getCookie("Authorization"),
          "Content-Type": "application/json",
        },
      })
    ).json();
  }
}
