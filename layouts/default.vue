// layouts/default.vue
<template>
  <div>
    <nuxt />
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
      this.clearUserInfo();
    },
    clearUserInfo() {
      Storage.clearCookie("novel_token");
      Storage.clearCookie("novel_userId");
    }
  }
};
</script>
