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
            window.setItem("novel_tid", response.tid);
            this.isShowNuxtContent = true;
          }
        });
    }
  }
};
</script>
