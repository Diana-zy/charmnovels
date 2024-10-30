// layouts/default.vue
<template>
  <div>
    <nuxt />
    <common-dialog @confirm="onConfirm" @cancel="onCancel" />
  </div>
</template>

<script>
export default {
  methods: {
    onConfirm() {
      // 确认操作处理
      console.log("Confirmed");
      // 这里可以执行一些重定向到登录页面等操作
    },
    onCancel() {
        console.log(window.location);
      // 取消操作处理
      console.log("Cancelled");
    }
  }
};
</script>

<style>
/* 你可以在这里添加布局相关的样式 */
</style>
