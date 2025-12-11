<template>
  <header class="back-header pc-hidden-flex" :class="{ 'header-page-content': isPageContent }">
    <custom-link :to="url" class="header-url">
      <div class="header-icon"></div>
      <div class="header-label" v-show="title">{{ title }}</div>
    </custom-link>
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
      type: String
    },
    isPageContent: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    position: {
      handler(val) {},
      immediate: true
    }
  },
  mounted() {
    document.documentElement.style.setProperty("--position", this.position);
  },
  methods: {
    handleClickBack() {
      this.$router.go(-1);
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
  background: $color4;
  z-index: 1000;
  display: flex;
  align-items: center;
  background: rgba(#fce6db, 0.54);
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
