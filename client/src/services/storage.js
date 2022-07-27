import Cookies from "js-cookie";

export function removeItem(itemToRemove) {
  Cookies.remove(itemToRemove, {path: ''});
}

export function getItem(item) {
  return Cookies.get(item);
}

export function addItem(name, value) {
  Cookies.set(name, value, { sameSite: 'strict', secure: true, path: '/' });
}

export function updateItem(name, newValue) {
  Cookies.remove(name);
  Cookies.set(name, newValue, { sameSite: 'strict', secure: true, path: '/' });
}

export function getUserName() {
  if (getItem("username")) {
    return getItem("username");
  } else return null;
}