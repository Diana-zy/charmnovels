<template>
  <header class="theme-dark">
    <custom-link v-show="isShowBack" to="/" class="icon-back">
      <i></i>
    </custom-link>
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
    background: $color4;
    border-bottom: 1px solid rgba($color2, 0.2);
  }
}

.icon-back {
  @include center;
  margin-right: 16px;
  i {
    @include icon(32px, 32px, "icon-arrow-active.png");
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
    ::v-deep .search-box {
      border: 1px solid rgba($color2, 0.6);
      .search-btn {
        background: rgba($color2, 0.6);
      }
      .search-input {
        color: $color8;
        &::placeholder {
          color: rgba($color8, 0.6);
        }
      }
    }
  }
}
</style>
