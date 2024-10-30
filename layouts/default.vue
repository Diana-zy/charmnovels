// layouts/default.vue
<template>
  <div>
    <nuxt ref="nuxt" />
    <common-dialog @confirm="onConfirm" @cancel="onCancel" />
  </div>
</template>

<script>
import Storage from "@/utils/storage";
import { simulateClick, filterFromPath } from "@/utils/utils";
export default {
  methods: {
    onConfirm() {
      const currenPagePath = window.location.pathname + window.location.search;
      Storage.setCookie("novel_preLoginPath", currenPagePath);
      simulateClick("/login/", "from", filterFromPath(window.location.pathname));
      this.clearUserInfo();
    },
    onCancel() {
      const customHeader = this.findComponent(this.$refs.nuxt.$children, "<CustomHeader>");
      if (customHeader) {
        customHeader.isLogin = false;
      }
      this.clearUserInfo();
    },
    clearUserInfo() {
      Storage.clearCookie("novel_token");
      Storage.clearCookie("novel_userId");
    },

    // 递归获取组件实例
    findComponent(children, componentName) {
      for (const child of children) {
        if (child._name === componentName) {
          return child;
        }
        const found = this.findComponent(child.$children, componentName);
        if (found) {
          return found;
        }
      }
      return null; // 如果没有找到，则返回 null
    }
  }
};
</script>
