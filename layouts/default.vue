// layouts/default.vue
<template>
  <div>
    <nuxt v-if="isShowNuxtContent" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShowNuxtContent: false
    };
  },
  mounted() {
    if (window.getItem("novel_tid")) {
      this.isShowNuxtContent = true;
    } else {
      this.getUserTid();
    }
  },
  methods: {
    async getUserTid() {
      await this.$axios
        .$get("/api/user/get_tid", {
          site_id: process.env.SITE_ID
        })
        .then((response) => {
          if (response.tid) {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const date = currentDate.getDate();
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();
            const seconds = currentDate.getSeconds();
            const currentTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
            // 设置缓存
            window.setItem("novel_tid", response.tid);
            window.setItem("novel_tid_time", currentTime);
            this.isShowNuxtContent = true;
          }
        });
    }
  }
};
</script>
