// plugins/global-data.js
import Vue from "vue";

export default ({ app }, inject) => {
  // 创建一个响应式的全局数据对象
  const globalData = Vue.observable({
    notification: {
      show: false,
      message: "",
      type: ""
    },
    dialog: {
      show: false,
      message: ""
    }
  });
  // 注入响应式的 globalData 对象
  inject("globalData", globalData);

  // 创建一个全局方法对象并注入
  inject("globalMethod", {
    // 显示通知
    showNotification: ({ message, type }) => {
      globalData.notification.show = true;
      globalData.notification.message = message;
      globalData.notification.type = type;
      // 在 3 秒后调用 hideNotification
      setTimeout(() => {
        app.$globalMethod.hideNotification();
      }, 3000);
    },
    // 隐藏通知
    hideNotification: () => {
      globalData.notification.show = false;
      globalData.notification.message = "";
      globalData.notification.type = "";
    },
    // 显示对话框
    showDialog: (message) => {
      globalData.dialog.show = true;
      globalData.dialog.message = message;
    },
    // 隐藏对话框
    hideDialog: () => {
      globalData.dialog.show = false;
      globalData.dialog.message = "";
    },
    updateUrlQuery: (context, attribute) => {
      if (context && attribute) {
        if (attribute instanceof Array) {
          const route = context.$route;
          const query = Object.assign({}, context.$route.query);
          attribute.forEach((item) => {
            delete query[item];
          });
          context.$router.replace({
            path: route.path,
            query: query
          });
        } else if (typeof attribute === "string") {
          const route = context.$route;
          const query = Object.assign({}, context.$route.query);
          delete query[attribute];
          context.$router.replace({
            path: route.path,
            query: query
          });
        }
      }
    }
  });
};
