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

// eslint-disable-next-line no-unused-vars
function getMainDomain() {
  const url = window.location.hostname; //
  const parts = url.split(".");
  if (parts.length > 2) {
    return parts.slice(-2).join(".");
  }
  return url;
}

function setCookie(name, value, daysToExpire) {
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

// 记录fbclid
(function () {
  const searchParams = new URLSearchParams(window.location.search);
  const fbclid = searchParams.get("fbclid");
  if (fbclid) {
    setCookie("hi_fbclid", fbclid);
  }
})();

// 用户首次站内行为
// eslint-disable-next-line no-unused-vars
function setUserFirstAction(action) {
  const userFirstAction = getItem("novel_userFirstAction");
  if (!userFirstAction) {
    setItem("novel_userFirstAction", action);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "User_first_action", first_type: action });
  }
}

// eslint-disable-next-line no-unused-vars
function setUserStayThreeMinutes() {
  const userStayThreeMinutes = getItem("novel_userStayThreeMinutes");
  if (!userStayThreeMinutes) {
    window.userStayThreeMinutesTimer = setTimeout(() => {
      setItem("novel_userStayThreeMinutes", true);
      window.dataLayer.push({ event: "User_stay_3s" });
    }, 3000);
    window.addEventListener("beforeunload", () => {
      window.userStayThreeMinutesTimer && clearTimeout(window.userStayThreeMinutesTimer);
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
    } else if (userPageAdActionData.showAdCount > 20) {
      pushShowAdCountValue = ">20";
    }
    window.dataLayer.push({
      event: "Banner_show",
      banner_show: pushShowAdCountValue
    });
  }
  // 页内点击
  else if (action === "click") {
    userPageAdActionData.clickAdCount++;
    let pushClickAdCountValue = 0;
    if (userPageAdActionData.clickAdCount <= 5) {
      pushClickAdCountValue = userPageAdActionData.clickAdCount;
    } else if (userPageAdActionData.clickAdCount > 5) {
      pushClickAdCountValue = ">5";
    }
    window.dataLayer.push({
      event: "Banner_click",
      banner_click: pushClickAdCountValue
    });
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
  } else if (userReadChapterData.allReadChapterCount > 30) {
    pushAllReadChapterCountValue = ">30";
  }
  window.dataLayer.push({
    event: "Chapter_read",
    chapter_read: pushAllReadChapterCountValue
  });

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
