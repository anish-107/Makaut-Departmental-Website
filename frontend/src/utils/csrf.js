/** csrf.js
 * @author Anish
 * @description This manages authorization
 * @date 2/12/2025
 * @returns nothing
 */


export function getCookie(name) {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift() || "";
  return "";
}

export function getAccessCsrfToken() {
  return getCookie("csrf_access_token");
}

export function getRefreshCsrfToken() {
  return getCookie("csrf_refresh_token");
}
