import Storage from "@/utils/storage";
export default function ({ $axios, $globalData, $globalMethod, redirect }) {
  // request interceptor
  $axios.interceptors.request.use(
    (config) => {
      // do something before request is sent
      /* 客户端请求 */
      if (!process.server) {
        config.headers.token = Storage.getCookie("novel_token") || "";
        config.headers.userId = Storage.getCookie("novel_userId") || "";
      }
      return config;
    },
    (error) => {
      // do something with request error
      return Promise.reject(error);
    }
  );
  $axios.onRequest((config) => {
    // console.log("Making request to " + config.url);
  });

  // response interceptor
  $axios.interceptors.response.use(
    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    (response) => {
      // console.log("response", response.config.url);
      const res = response.data;
      if (res.success === true) {
        return res;
      } else {
        // if the custom code is not 200, it is judged as an error.
      }
      return Promise.reject(res);
    },
    (error) => {
      console.log("err" + error); // for debug

      return Promise.reject(error);
    }
  );

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status);
    if (code === 400) {
      redirect("/404");
    }
    if (code === 401) {
      /* session过期 */
      if (!process.server) {
        $globalMethod.showDialog("Your session has expired. Please log in again.");
      }
    }
    if (code === 500) {
      redirect("/500");
    }
  });
}
