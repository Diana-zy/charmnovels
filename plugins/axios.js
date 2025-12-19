export default function ({ $axios, $globalData, $globalMethod, redirect }) {
  // request interceptor
  $axios.interceptors.request.use(
    (config) => {
      // do something before request is sent
      /* 客户端请求 */
      if (process.client) {
        config.headers.tid = window.getItem("novel_tid") || "";
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
      // const { msg } = response.data;
      // if (msg === "tid is not exist") {
      //   window.removeItem("novel_tid");
      //   window.history.replaceState({}, "", window.location.href);
      //   console.log("error:tid is not exist", 1111);
      //   return Promise.reject("error:tid is not exist");
      // }
      if (res.success === true) {
        return res;
      } else {
        // if the custom code is not 200, it is judged as an error.
      }
      return Promise.reject(res);
    },
    (error) => {
      //接口返回tid不存在处理
      if (error.response) {
        const responseData = error.response.data; // 这就是接口返回的JSON
        console.log(responseData, "responseData");
        const { msg } = responseData;
        if (msg === "tid is not exist") {
          window.removeItem("novel_tid");
          // 在拿到响应后刷新当前页面
          if (process.client) {
            setTimeout(() => {
              window.location.reload();
            }, 100);
          }
        }
      }
      console.log("err" + error); // for debug

      return Promise.reject(error);
    }
  );
}
