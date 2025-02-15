import $api from "@/http";

export default class User {
  static async polls() {
    return $api
      .get(`poll`)
      .then((res) => res)
      .catch((err) => err);
  }

  static async vote(pollId, answerId) {
    return $api
      .patch(`poll/vote/${pollId}`, { answer_id: answerId })
      .then((res) => res)
      .catch((err) => err);
  }

  static async unvote(pollId, answerId) {
    return $api
      .patch(`poll/unvote/${pollId}`, { answer_id: answerId })
      .then((res) => res)
      .catch((err) => err);
  }
}
