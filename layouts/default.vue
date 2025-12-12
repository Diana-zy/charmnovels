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
    if (window.getCookie("novel_tid")) {
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
            window.setCookie("novel_tid", response.tid, 365);
            this.isShowNuxtContent = true;
          }
        });
    }
  }
};
</script>
