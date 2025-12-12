// 创建 axios 实例
import axios from 'axios'


const instance = axios.create({
  baseURL: process.env.PROD_API_URL
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    if (process.client) {
      config.headers.tid = window.getCookie("novel_tid") || "";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.success === true) {
      return res;
    } else {
      return Promise.reject(res);
    }
  },
  (error) => {
    console.log("err" + error);
    return Promise.reject(error);
  }
)

// 获取用户信息
export function getUserInfo() {
  return instance.get("/api/user/user_info", {
    site_id: process.env.SITE_ID
  });
}
// 获取SKU列表
export function getSKUList(data) {
  return instance.post("/api/user/sku_list", {
    site_id: process.env.SITE_ID,
    ...data
  });
}
