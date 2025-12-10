/* eslint-disable no-unused-vars */
function setItem(key, value) {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Error setting item in localStorage", error);
  }
}

function getItem(key) {
  try {
    const serializedValue = localStorage.getItem(key);
    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (error) {
    console.error("Error getting item from localStorage", error);
    return null;
  }
}

function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing item from localStorage", error);
  }
}

function setSessionStorageItem(key, value) {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Error setting item in sessionStorage", error);
  }
}

function getSessionStorageItem(key) {
  try {
    const serializedValue = sessionStorage.getItem(key);
    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (error) {
    console.error("Error getting item from sessionStorage", error);
    return null;
  }
}

function removeSessionStorageItem(key) {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing item from sessionStorage", error);
  }
}

function getMainDomain() {
  const url = window.location.hostname;
  const parts = url.split(".");
  if (parts.length > 2) {
    return parts.slice(-2).join(".");
  }
  return url;
}

function setCookie(name, value, daysToExpire = 1) {
  const date = new Date();
  date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000); // 设置过期时间为指定的天数之后
  const expires = "; expires=" + date.toUTCString(); // 转换为GMT格式的字符串
  document.cookie =
    name +
    "=" +
    (value || "") +
    expires +
    "; path=/; domain=" +
    getMainDomain(); // 设置cookie
}

function setCookieToDay(name, value) {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  const expires = "; expires=" + date.toUTCString();
  document.cookie =
    name +
    "=" +
    (value || "") +
    expires +
    "; path=/; domain=" +
    getMainDomain();
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function getHostname() {
  const currentHostName = window.location.hostname;
  if (currentHostName.startsWith("www")) {
    const list = currentHostName.split(".");
    if (list[0] === "www") {
      return currentHostName.replace("www.", "");
    }
    return currentHostName.replace("www", "");
  }
  return currentHostName;
}

function getParam(queryKey) {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.has(queryKey) ? searchParams.get(queryKey).trim() : "";
  } catch (c) {
    return "";
  }
}

function getValueByURLOrCookie(val) {
  let key = "hi_" + val;
  if (val.includes("hi_")) {
    key = val;
  }
  const buffer = getParam(val) || getCookie(key) || "unknown";
  setCookieToDay(key, buffer);
  return buffer;
}

// 获取来源对应的clid
function getSourceClid(source = "tiktok") {
  const map = {
    tiktok: "ttclid",
    taboola: "tblci",
    outbrain: "dicbo",
    facebook: "fbclid",
  };

  const key = typeof source === "string" ? source.toLowerCase() : "";
  const param = map[key];
  if (!param) {
    return { hi_source_clid: "unknown" };
  }

  return { hi_source_clid: getValueByURLOrCookie(param) };
}

function pushEventParamsToGtm(eventName, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });
}
