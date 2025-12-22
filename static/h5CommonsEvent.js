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
    facebook: "fbclid"
  };

  const key = typeof source === "string" ? source.toLowerCase() : "";
  const param = map[key];
  if (!param) {
    return { hi_source_clid: "unknown" };
  }

  return { hi_source_clid: getValueByURLOrCookie(param) };
}

// 记录用户首次访问的落地页
(function () {
  const searchParams = new URLSearchParams(window.location.search);
  // 未携带 hi_first_time 参数时，记录首次访问时间
  if (!searchParams.has("hi_first_time")) {
    const hiFirstTime = new Date().getTime();
    setLandingPageUrl(hiFirstTime);
  } else {
    // 携带 hi_first_time 参数时，判断是否与缓存时间一致，不一致则更新缓存时间
    let hiFirstTime = searchParams.get("hi_first_time");
    const hiFirstTimeCache = getCookie("hi_first_time");
    if (hiFirstTime !== hiFirstTimeCache) {
      hiFirstTime = new Date().getTime();
      setLandingPageUrl(hiFirstTime);
    }
  }
})();
// 更新落地页Url
function setLandingPageUrl(hiFirstTime) {
  const searchParams = new URLSearchParams(window.location.search);
  setCookie("hi_first_time", hiFirstTime);
  searchParams.set("hi_first_time", hiFirstTime);
  const updateUrl = `${window.location.origin}${
    window.location.pathname
  }?${searchParams.toString()}`;
  window.history.replaceState({}, "", updateUrl);
  setCookie("hi_landing_page", updateUrl);
}



// 上报事件到后端接口
// eslint-disable-next-line no-unused-vars
function trackEventToApi(eventName) {
  const currentHref = window.location.href;
  const currentDomain = window.location.hostname;
  const landingPageUrl = getCookie("hi_landing_page");
  const userAgent = navigator.userAgent;
  const currentCookie = document.cookie;
  const searchParams = new URLSearchParams(window.location.search);
  const source = getParam("hi_source")
  const { hi_source_clid } = getSourceClid(source);
  fetch("https://api.tapmygame.com/api/zh/sjzh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      site_id: "charmnovels",
      hi_source: source, // 媒体渠道
      scid: hi_source_clid, // 媒体渠道的ClickID
      sjmc: eventName, // 事件名称
      cc: window.youknowwho_ip_country || "", // 国家code
      curl: currentHref, // 发生转化页面的完整url
      lurl: landingPageUrl, // 落地页的完整url
      domain: currentDomain, // 完整域名
      user_agent: userAgent,
      cookie: currentCookie
    })
  });
}

function pushEventParamsToGtm(eventName, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });
}
