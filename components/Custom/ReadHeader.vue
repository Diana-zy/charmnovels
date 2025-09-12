<template>
  <header class="theme-dark read-header">
    <div v-show="isShowBack" @click="handlePageBack" class="icon-back">
      <i></i>
    </div>
    <div v-if="currentChapterDetail" class="chapter-box">
      <span class="progress"
        >{{ currentChapterDetail.chapter_num }} /
        {{ currentChapterDetail.novel_info.chapter }}</span
      >
      <span class="title">Chapter {{ currentChapterDetail.chapter_num }}</span>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    isShowBack: {
      type: Boolean,
      default: false
    },
    currentChapterDetail: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Object | null,
      required: true
    }
  },
  methods: {
    handlePageBack() {
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

<style lang="scss" scoped>
header {
  position: fixed;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  z-index: 9;
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  height: 64px;
  margin: 0 auto;
  &:before {
    content: "";
    display: inline-block;
    width: 100vw;
    height: 100%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
    background: $color7;
  }
}

.icon-back {
  @include center;
  margin-right: 16px;
  i {
    @include icon(32px, 32px, "icon-back-white.png");
  }
}

.chapter-box {
  @include center;
  gap: 16px;
  color: rgba($color1, 0.4);
}

@media screen and (max-width: 750px) {
  header {
    height: vw(96);
    padding: 0 vw(46);
  }
  .icon-back {
    margin-right: vw(16);
    i {
      width: vw(48);
      height: vw(48);
    }
  }
  .chapter-box {
    font-size: vw(24);
    gap: vw(24);
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 750px) {
  .theme-dark {
    &:before {
      background: $color7;
    }
  }
}
</style>
