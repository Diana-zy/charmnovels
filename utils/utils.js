// 模拟点击链接
function simulateClick(route, key, value, className) {
  // 获取当前页面的 URL 参数
  const currentURLSearchParams = new URLSearchParams(window.location.search);
  const currentPathname = window.location.pathname;
  const from = filterFromPath(currentPathname);

  // 创建一个新的 URLSearchParams 对象
  const newURLSearchParams = new URLSearchParams();

  // 将当前页面的 URL 参数添加到新对象中
  for (const [key, value] of currentURLSearchParams) {
    // 过滤掉章节ID
    if (key !== "ch" && key !== "from") {
      newURLSearchParams.append(key, value);
    }
    // 添加新的 from 参数
    if (key === "from") {
      newURLSearchParams.append(key, encodeURIComponent(from));
    }
  }

  if (key) {
    // 添加新链接中的参数，确保替换重复属性
    if (key === "text") {
      newURLSearchParams.set(key, value);
    } else {
      newURLSearchParams.set(key, encodeURIComponent(value));
    }
  }

  // 创建新的 URL 对象
  const newURL = new URL(route, window.location.origin);
  newURL.search = newURLSearchParams.toString();

  // 创建一个隐藏的 <a> 标签
  const link = document.createElement("a");
  link.href = newURL.toString();
  link.style.display = "none";
  className && link.classList.add(className);
  document.body.appendChild(link);

  // 模拟点击
  link.click();

  // 删除 <a> 标签
  document.body.removeChild(link);
}

function generateCustomLink(url) {
  let targetPath = url;
  let chapterId = "";
  if (url.includes("?ch=")) {
    targetPath = url.split("?ch=")[0];
    chapterId = url.split("?ch=")[1];
  }
  const currentParams = new URLSearchParams(window.location.search);

  currentParams.delete("ch");
  /* 处理小说章节页面传参 */
  if (targetPath.includes("/read/")) {
    currentParams.append("ch", chapterId);
  }

  // 生成新的查询参数字符串
  const queryString = currentParams.toString();
  return `${targetPath}?${queryString}`;
}

// 过滤from
function filterFromPath(path) {
  // 定义路径与类型的映射关系
  const pathTypeMappings = [
    { pattern: /^\/novel\/[\w-]+\/$/, type: "novel" },
    { pattern: /^\/read\/[\w-]+\/$/, type: "read" },
    { pattern: /^\/$/, type: "home" }
  ];
  // 查找匹配的路径类型
  const matchedPathType = pathTypeMappings.find((mapping) => mapping.pattern.test(path));
  const from = matchedPathType ? matchedPathType.type : path.replaceAll("/", "");
  return from;
}

// 校验邮箱格式
function validateEmail(email) {
  // 使用正则表达式验证邮箱格式
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// 重新排序
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // 生成一个随机索引，范围是 [0, i]
    [array[i], array[j]] = [array[j], array[i]]; // 交换当前位置和随机位置的元素
  }
  return array;
}

// 计算星星组的显示
function getStarListStyle(scoreNum) {
  const result = [];
  const score = scoreNum / 2; // 四舍五入到0.5分
  const integer = Math.floor(score);
  const hasDecimal = score % 1 !== 0;
  // 先将on添加到list中
  for (let i = 0; i < integer; i++) {
    result.push("icon-star-on");
  }
  // 将半选添加到list
  if (hasDecimal) result.push("icon-star-half");
  // 若不满5个，剩下的添加off直到满5个为止
  for (let i = result.length; i < 5; i++) {
    result.push("icon-star-off");
  }
  return result;
}

function getStarScore(score) {
  const newScore = score.length === 1 ? score + ".0" : score || 4.8;
  return newScore;
}

function getTargetDomain() {
  const currentDomain = window.location.host;
  let targetDomain = "";
  // eslint-disable-next-line no-useless-escape
  const domainPattern = /^(www[0-9]*|[0-9]*)\.?([^\.]+)\.([a-z]{2,})$/;
  const match = currentDomain.match(domainPattern);
  if (match) {
    const prefix = match[1];
    if (!prefix) {
      targetDomain = `www.${currentDomain}`;
    } else if (prefix.startsWith("www")) {
      if (prefix === "www") {
        targetDomain = currentDomain.substring(4);
      } else {
        targetDomain = currentDomain.substring(3);
      }
    } else {
      targetDomain = `www${currentDomain}`;
    }
  } else {
    targetDomain = currentDomain;
  }
  return targetDomain;
}

function getQueryParam(paramName, url = window.location.href) {
  try {
    const params = new URL(url).searchParams;
    return params.get(paramName) || null;
  } catch (error) {
    console.error("Invalid URL", error);
    return null;
  }
}

function throttle(fn, delay = 1500) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now; // 更新上次执行时间
    }
  };
}

export {
  simulateClick,
  generateCustomLink,
  filterFromPath,
  validateEmail,
  shuffleArray,
  getStarListStyle,
  getStarScore,
  getTargetDomain,
  getQueryParam,
  throttle
};
