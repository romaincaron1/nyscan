import jwtDecode from "jwt-decode";
import { getItem, removeItem } from "./storage";

export function hasAuthenticated() {
    const token = getItem('x-auth-token');
    const tokenIsValid = token ? validToken(token) : false;
    
    if (false === tokenIsValid) {
        removeItem('x-auth-token');
    }

    return tokenIsValid;
}

export function hasIsAdmin() {
    if (hasAuthenticated()) {
        const token = getItem('x-auth-token');
        const { user: user } = jwtDecode(token);
        const isAdmin = user.isAdmin;
        return isAdmin;
    } else {
        return false;
    }
}

function validToken(token) {
    const { exp: expiration } = jwtDecode(token);

    if (expiration * 1000 > new Date().getTime()) {
        return true;
    }

    return false;
}