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

// eslint-disable-next-line no-unused-vars
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

// eslint-disable-next-line no-unused-vars
function removeSessionStorageItem(key) {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing item from sessionStorage", error);
  }
}

// eslint-disable-next-line no-unused-vars
function getMainDomain() {
  const url = window.location.hostname; //
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
    name + "=" + (value || "") + expires + "; path=/; domain=" + this.getMainDomain(); // 设置cookie
}

// eslint-disable-next-line no-unused-vars
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
  const sourceClickId = getCookie("hi_souceClickId");
  const source = window.getParam("hi_source");
  fetch("https://api.tapmygame.com/api/zh/sjzh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      site_id: "charmnovels-free",
      hi_source: source, // 媒体渠道
      scid: sourceClickId || "", // 媒体渠道的ClickID
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

// 记录fbclid
(function () {
  const searchParams = new URLSearchParams(window.location.search);
  const sourceClickId = searchParams.get("fbclid") || searchParams.get("ttclid");
  if (sourceClickId) {
    setCookie("hi_souceClickId", sourceClickId);
  }
})();

// 用户首次站内行为
// eslint-disable-next-line no-unused-vars
function setUserFirstAction(action) {
  const userFirstAction = getSessionStorageItem("novel_userFirstAction");
  if (!userFirstAction) {
    setSessionStorageItem("novel_userFirstAction", action);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "User_first_action", first_type: action });
  }
}

// eslint-disable-next-line no-unused-vars
function setUserStayThreeSeconds() {
  const userStayThreeSeconds = getItem("novel_userStayThreeSeconds");
  if (!userStayThreeSeconds) {
    window.userStayThreeSecondsTimer = setTimeout(() => {
      setItem("novel_userStayThreeSeconds", true);
      window.dataLayer.push({ event: "User_stay_3s" });
    }, 3000);
    window.addEventListener("beforeunload", () => {
      window.userStayThreeSecondsTimer && clearTimeout(window.userStayThreeSecondsTimer);
    });
  }
}

// eslint-disable-next-line no-unused-vars
function setUserReadPageClickAction(action) {
  window.dataLayer.push({ event: "Novel_click_action", click_type: action });
}

// 设置单用户页内广告相关的数据
// eslint-disable-next-line no-unused-vars
function setUserPageAdActionData(action) {
  let userPageAdActionData = getItem("novel_userPageAdActionData");
  if (!userPageAdActionData) {
    userPageAdActionData = {
      showAdCount: 0,
      clickAdCount: 0
    };
  }
  // 页内实际展示
  if (action === "show") {
    userPageAdActionData.showAdCount++;
    const pushGtmShowAdCountTypeArr = [5, 10, 15, 20];
    let pushShowAdCountValue = 0;
    if (pushGtmShowAdCountTypeArr.includes(userPageAdActionData.showAdCount)) {
      pushShowAdCountValue = userPageAdActionData.showAdCount;
      window.dataLayer.push({
        event: "Banner_show",
        banner_show: pushShowAdCountValue
      });
    } else if (userPageAdActionData.showAdCount > 20) {
      pushShowAdCountValue = ">20";
      window.dataLayer.push({
        event: "Banner_show",
        banner_show: pushShowAdCountValue
      });
    }
  }
  // 页内点击
  else if (action === "click") {
    userPageAdActionData.clickAdCount++;
    let pushClickAdCountValue = 0;
    if (userPageAdActionData.clickAdCount <= 5) {
      pushClickAdCountValue = userPageAdActionData.clickAdCount;
      window.dataLayer.push({
        event: "Banner_click",
        banner_click: pushClickAdCountValue
      });
    } else if (userPageAdActionData.clickAdCount > 5) {
      pushClickAdCountValue = ">5";
      window.dataLayer.push({
        event: "Banner_click",
        banner_click: pushClickAdCountValue
      });
    }
  }
  setItem("novel_userPageAdActionData", userPageAdActionData);
}

// 上报用户阅读章节数的数据
// eslint-disable-next-line no-unused-vars
function setUserReadChapterData(chapterId) {
  let userReadChapterData = getItem("novel_userReadChapterData");
  if (!userReadChapterData) {
    userReadChapterData = {
      allReadChapterCount: 0,
      realReadChapterCount: 0
    };
  }
  //   记录任意阅读次数
  userReadChapterData.allReadChapterCount++;
  const pushGtmAllReadChapterCountTypeArr = [1, 2, 3, 5, 10, 15, 20, 25, 30];
  let pushAllReadChapterCountValue = 0;
  if (pushGtmAllReadChapterCountTypeArr.includes(userReadChapterData.allReadChapterCount)) {
    pushAllReadChapterCountValue = userReadChapterData.allReadChapterCount;
    window.dataLayer.push({
      event: "Chapter_read",
      chapter_read: pushAllReadChapterCountValue
    });
  } else if (userReadChapterData.allReadChapterCount > 30) {
    pushAllReadChapterCountValue = ">30";
    window.dataLayer.push({
      event: "Chapter_read",
      chapter_read: pushAllReadChapterCountValue
    });
  }

  // 记录真实阅读次数
  const userReadChapterIdList = getItem("novel_userReadChapterIdList") || [];
  if (!userReadChapterIdList.includes(chapterId)) {
    userReadChapterIdList.push(chapterId);
    setItem("novel_userReadChapterIdList", userReadChapterIdList);
    userReadChapterData.realReadChapterCount++;
    const pushGtmRealReadChapterCountTypeArr = [2, 3, 5];
    if (pushGtmRealReadChapterCountTypeArr.includes(userReadChapterData.realReadChapterCount)) {
      window.dataLayer.push({
        event: "Chapter_read",
        chapter_read: `${userReadChapterData.realReadChapterCount}_read`
      });
    }
  }

  setItem("novel_userReadChapterData", userReadChapterData);
}

// 记录用户观看到第一个和第二个页内
// eslint-disable-next-line no-unused-vars
function setUserWatchFirstTwoPageAd(adIndex) {
  const userWatchFirstTwoPageAd = getSessionStorageItem("novel_userWatchFirstTwoPageAd");
  if (adIndex === 1 && !userWatchFirstTwoPageAd) {
    setSessionStorageItem("novel_userWatchFirstTwoPageAd", 1);
    window.dataLayer.push({
      event: "Banner_show_type",
      banner_show: "first"
    });
  } else if (adIndex === 2 && userWatchFirstTwoPageAd === 1) {
    setSessionStorageItem("novel_userWatchFirstTwoPageAd", 2);
    window.dataLayer.push({
      event: "Banner_show_type",
      banner_show: "second"
    });
  }
}

// 上报用户阅读章节数的数据到FaceBook
// eslint-disable-next-line no-unused-vars
function setUserReadChapterToFaceBookData(chapterId) {
  let userReadChapterToFaceBookData = getItem("novel_userReadChapterToFaceBookData");
  const userScClid = getCookie("hi_souceClickId") || "unknown";
  if (!userReadChapterToFaceBookData) {
    userReadChapterToFaceBookData = {
      userScClid,
      allReadChapterCount: 0,
      realReadChapterCount: 0
    };
  }
  // 如果有数据但fbclid不一致，则重置数据
  else if (userScClid !== userReadChapterToFaceBookData.userScClid) {
    userReadChapterToFaceBookData = {
      userScClid,
      allReadChapterCount: 0,
      realReadChapterCount: 0
    };
    setItem("novel_userReadChapterIdToFaceBookList", []);
  }
  //   记录任意阅读次数
  userReadChapterToFaceBookData.allReadChapterCount++;
  const pushFaceBookAllReadChapterCountTypeArr = [1, 2, 3, 5, 10, 20, 30];
  let pushAllReadChapterCountValue = 0;
  if (
    pushFaceBookAllReadChapterCountTypeArr.includes(
      userReadChapterToFaceBookData.allReadChapterCount
    )
  ) {
    pushAllReadChapterCountValue = userReadChapterToFaceBookData.allReadChapterCount;
    trackEventToPixel(`Chapter_${pushAllReadChapterCountValue}`);
  }
  // 上报标准事件
  if (userReadChapterToFaceBookData.allReadChapterCount === 1) {
    trackEventToPixel("Chapter_1", false);
  }

  // 记录真实阅读次数
  const userReadChapterIdToFaceBookList = getItem("novel_userReadChapterIdToFaceBookList") || [];
  if (!userReadChapterIdToFaceBookList.includes(chapterId)) {
    userReadChapterIdToFaceBookList.push(chapterId);
    setItem("novel_userReadChapterIdToFaceBookList", userReadChapterIdToFaceBookList);
    userReadChapterToFaceBookData.realReadChapterCount++;
    const pushFaceBookRealReadChapterCountTypeArr = [2, 3, 5];
    if (
      pushFaceBookRealReadChapterCountTypeArr.includes(
        userReadChapterToFaceBookData.realReadChapterCount
      )
    ) {
      trackEventToPixel(`Chapter_${userReadChapterToFaceBookData.realReadChapterCount}_read`);
    }

    // 上报标准事件
    if (userReadChapterToFaceBookData.realReadChapterCount === 2) {
      trackEventToPixel("Chapter_2_read", false);
    }
    if (userReadChapterToFaceBookData.realReadChapterCount === 5) {
      trackEventToPixel("Chapter_5_read", false);
    }
  }

  setItem("novel_userReadChapterToFaceBookData", userReadChapterToFaceBookData);
}

// 设置用户页内广告相关的数据到FaceBook
// eslint-disable-next-line no-unused-vars
function setUserPageAdActionToFaceBookData(action, clickAdInfo) {
  let userPageAdActionToFaceBookData = getItem("novel_userPageAdActionToFaceBookData");
  const userScClid = getCookie("hi_souceClickId") || "unknown";
  if (!userPageAdActionToFaceBookData) {
    userPageAdActionToFaceBookData = {
      userScClid,
      showAdCount: 0
    };
  } // 如果有数据但fbclid不一致，则重置数据
  else if (userScClid !== userPageAdActionToFaceBookData.userScClid) {
    userPageAdActionToFaceBookData = {
      userScClid,
      showAdCount: 0
    };
    setItem("novel_userClickPageAdToChapterList", []);
  }
  // 页内实际展示
  if (action === "show") {
    userPageAdActionToFaceBookData.showAdCount++;
    setItem("novel_userPageAdActionToFaceBookData", userPageAdActionToFaceBookData);
    const pushFaceBookShowAdCountTypeArr = [5, 10];
    let pushShowAdCountValue = 0;
    if (pushFaceBookShowAdCountTypeArr.includes(userPageAdActionToFaceBookData.showAdCount)) {
      pushShowAdCountValue = userPageAdActionToFaceBookData.showAdCount;
      trackEventToPixel(`Banner_show_${pushShowAdCountValue}`);
    }
    // 上报标准事件
    if (userPageAdActionToFaceBookData.showAdCount === 5) {
      trackEventToPixel("Banner_show_5", false);
    }
  }
  // 页内点击
  else if (action === "click") {
    const searchParams = new URLSearchParams(window.location.search);
    const chapterId = searchParams.get("ch");
    const userClickPageAdToChapterList = getItem("novel_userClickPageAdToChapterList") || [];
    if (!userClickPageAdToChapterList.includes(chapterId)) {
      userClickPageAdToChapterList.push(chapterId);
      setItem("novel_userClickPageAdToChapterList", userClickPageAdToChapterList);
      trackEventToPixel("Banner_normal_click");
      trackEventToPixel("Banner_normal_click", false);
      window.dataLayer.push({
        event: "Banner_normal_click",
        banner_info: clickAdInfo
      });
    }
  }
}

// Purchase事件去重检查函数
function canReportPurchaseEvent() {
  const currentScClid = getCookie("hi_souceClickId") || "unknown";
  const purchaseEvents = getItem("novel_fbclidPurchaseEvents") || {};

  // 检查当前fbclid是否已上报过Purchase事件
  if (purchaseEvents[currentScClid] && purchaseEvents[currentScClid].isPurchaseReported) {
    return false;
  }

  return true;
}

// Purchase事件上报记录函数
function recordPurchaseEvent() {
  const currentScClid = getCookie("hi_souceClickId") || "unknown";
  const purchaseEvents = getItem("novel_fbclidPurchaseEvents") || {};

  // 记录当前fbclid的Purchase事件上报状态
  purchaseEvents[currentScClid] = {
    isPurchaseReported: true,
    firstReportTime: new Date().getTime()
  };

  setItem("novel_fbclidPurchaseEvents", purchaseEvents);
}

function trackEvent(source, eventName, isCustomEvent = true) {
  // // 特殊处理Purchase事件的去重逻辑
  // if (eventName === "Purchase" && !canReportPurchaseEvent()) {
  //   return;
  // }

  if (source === "tiktok") {
    isCustomEvent === false && window.ttq?.track?.(eventName);
  } else if (source === "facebook") {
    if (isCustomEvent) {
      window.fbq?.("trackCustom", eventName);
    } else {
      eventName === "Purchase"
        ? window.fbq?.("track", eventName, {
            currency: "USD",
            value: 1
          })
        : window.fbq?.("track", eventName);
    }
  }

  // 标准事件才上报给接口
  isCustomEvent === false && trackEventToApi(eventName);

  // // 记录Purchase事件上报状态
  // if (eventName === "Purchase") {
  //   recordPurchaseEvent();
  // }
}

function trackEventToPixel(eventKey, isCustomEvent = true) {
  const eventNameObj = {
    Chapter_1: {
      tiktok: "ViewContent",
      facebook: "ViewContent"
    },
    Chapter_2_read: {
      tiktok: "CompleteRegistration",
      facebook: "CompleteRegistration"
    },
    Chapter_5_read: {
      tiktok: "InitiateCheckout",
      facebook: "InitiateCheckout"
    },
    Banner_show_5: {
      tiktok: "AddPaymentInfo",
      facebook: "StartTrial"
    },
    Banner_normal_click: {
      tiktok: "AddToCart",
      facebook: "AddToCart"
    },
    Next_chapter_click: {
      tiktok: "Purchase",
      facebook: "Purchase"
    }
  };

  const source = window.getParam("hi_source");
  let eventName = "";
  isCustomEvent ? (eventName = eventKey) : (eventName = eventNameObj[eventKey][source]);

  const pixelId = window.getParam("hi_pc");
  if (source && pixelId && eventName) {
    trackEvent(source, eventName, isCustomEvent);
  }
}
