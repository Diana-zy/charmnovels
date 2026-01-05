<template>
  <header class="back-header pc-hidden-flex" :class="{ 'header-page-content': isPageContent }">
    <custom-link v-if="url" :to="url" class="header-url">
      <div class="header-icon"></div>
      <div class="header-label" v-show="title">{{ title }}</div>
    </custom-link>
    <div v-else class="header-url" @click="handleClickBack">
      <div class="header-icon"></div>
      <div class="header-label" v-show="title">{{ title }}</div>
    </div>
  </header>
</template>

<script>
export default {
  name: "BackHeader",
  props: {
    title: {
      type: String,
      default: ""
    },
    position: {
      type: String,
      default: "sticky"
    },
    url: {
      type: String,
      default: "/"
    },
    isPageContent: {
      type: Boolean,
      default: false
    },
    needBackModel: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    position: {
      handler(val) {
        if (val && process.client) {
          document.documentElement.style.setProperty("--position", val);
        }
      },
      immediate: true
    }
  },
  mounted() {
    document.documentElement.style.setProperty("--position", this.position);
  },
  methods: {
    handleClickBack(e) {
      if (this.needBackModel) {
        this.$emit("handleOpenRecommendBox");
        return;
      }
      if (navigator.userAgent.includes("MSIE") && !navigator.userAgent.includes("Opera")) {
        // IE
        if (history.length > 0) {
          window.history.go(-1);
        } else {
          window.location.href = "/";
        }
      } else {
        // 非IE浏览器
        // eslint-disable-next-line no-lonely-if
        if (
          navigator.userAgent.includes("Firefox") ||
          navigator.userAgent.includes("Opera") ||
          navigator.userAgent.includes("Safari") ||
          navigator.userAgent.includes("Chrome") ||
          navigator.userAgent.includes("WebKit")
        ) {
          if (window.history.length > 1) {
            window.history.go(-1);
          } else {
            window.location.href = "/";
          }
        } else {
          // 未知的浏览器
          window.history.go(-1);
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
:root {
  --position: "sticky";
}
.back-header {
  width: 100vw;
  position: var(--position);
  top: 0;
  padding: 0 vw(46);
  height: vw(96);
  z-index: 1000;
  display: flex;
  align-items: center;
  background: #fef1ea;
  opacity: 1;
}
.header-url {
  display: flex;
}
.header-page-content {
  margin-left: vw(-46);
}
.header-icon {
  margin-right: vw(16);
  @include icon(vw(48), vw(48), "icon-arrow-left.png");
}
.header-label {
  font-weight: 600;
  font-size: vw(28);
  color: $color2;
  text-align: left;
  line-height: vw(48);
  @include ellipsis();
}
</style>
