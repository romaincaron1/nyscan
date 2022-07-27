import { instance } from "./instance";
import { getItem, updateItem } from "./storage";

export async function getMe() {
  return new Promise((resolve, reject) => {
    const token = getItem("x-auth-token");
    instance.defaults.headers.common["x-auth-token"] = `Bearer ${token}`;
    instance
      .get("/users/me")
      .then((response) => {
        const user = response.data.user;
        resolve(user);
      })
      .catch((err) => {
        reject(err);
      });
  });
}