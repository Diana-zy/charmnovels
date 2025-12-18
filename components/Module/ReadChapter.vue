<template>
  <div :class="['chapter-container', { 'chapter-container-dark': theme === 'dark' }]">
    <div class="chapter-header">
      <h3>Chapters</h3>
      <i class="icon-close" @click="$emit('close-chapter-popup')"></i>
    </div>
    <div class="chapter-content">
      <!-- 正序倒序 -->
      <div class="chapter-item sort-row" @click="changeSortType">
        <i
          :class="[
            sortType === 'asc'
              ? `icon-sort-down${theme === 'light' ? '-black' : ''}`
              : `icon-sort-up${theme === 'light' ? '-black' : ''}`
          ]"
        ></i>
        <span>{{ chaptersList.length }} Chapter</span>
      </div>
      <!-- 章节列表 -->
      <div class="chapter-list">
        <div
          v-for="(item, i) in chaptersList"
          :key="i"
          :ref="item.id === currentChapterId ? 'activeChapter' : ''"
        >
          <custom-link
            :to="`/read/?ch=${item.id}`"
            :class="['chapter-item', item.id === currentChapterId ? 'chapter-item-active' : '']"
            @click.native="(event) => handleClickChapter(event, item)"
          >
            <div class="tag-current"><i class="icon-chapter-current"></i></div>
            <span>Chapter {{ item.chapter_num }}</span>
            <!--            <i v-if="!item.is_unlock && purchaseStatus !== 2" class="icon-ad-lock"></i>-->
            <i v-if="item.locked_chapter && !item.is_unlock" class="icon-lock"></i>
          </custom-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chapters: {
      type: Array,
      default: () => []
    },
    purchaseStatus: {
      type: Number,
      default: 0
    },
    locked_chapter: {
      type: Number,
      default: 0
    },
    is_unlock: {
      type: Number,
      default: 0
    },
    currentChapterId: {
      type: Number,
      default: 0
    },
    theme: {
      type: String,
      default: "light" // light: 白色主题, dark: 黑色主题
    }
  },
  data() {
    return {
      chaptersList: this.chapters,
      sortType: "asc" // asc: 正序, desc: 倒序
    };
  },
  watch: {
    chapters(newVal) {
      this.chaptersList = newVal;
    }
  },
  mounted() {
    this.scrollToActiveChapter();
  },
  methods: {
    scrollToActiveChapter() {
      const activeChapterElement = this.$refs.activeChapter; // 获取到被选中的章节元素
      if (activeChapterElement && activeChapterElement.length > 0) {
        activeChapterElement[0].scrollIntoView({ behavior: "auto", block: "center" }); // 滚动到视图
      }
    },
    changeSortType() {
      this.sortType = this.sortType === "asc" ? "desc" : "asc";
      this.chaptersList.sort((a, b) => {
        return this.sortType === "asc"
          ? a.chapter_num - b.chapter_num
          : b.chapter_num - a.chapter_num;
      });
      this.$nextTick(() => {
        this.scrollToActiveChapter();
      });
    },
    handleClickChapter(event, item) {
      return;
      this.$emit("change-chapter", item);
    }
  }
};
</script>

<style scoped lang="scss">
.chapter-container {
  width: 368px;
  height: 640px;
  background: $color4;
  box-shadow: 0 4px 16px 0 rgba($color6, 0.15);
  border-radius: 8px;
}
.chapter-header {
  display: flex;
  align-items: center;
  height: 56px;
  padding-left: 24px;
  border-bottom: 1px solid rgba($color2, 0.1);
}
h3 {
  line-height: 48px;
  font-size: 20px;
  font-family: "seb";
}
.icon-close {
  display: none;
}
.chapter-content {
  padding: 0 24px;
}
.sort-row.chapter-item {
  display: none;
}
.chapter-list {
  height: 560px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px; /* 设置滚动条的宽度 */
  }
  &::-webkit-scrollbar-track {
    background: transparent; /* 滚动条背景颜色 */
  }
  &::-webkit-scrollbar-thumb {
    background: #ffd8bb; /* 滚动条颜色 */
    border-radius: 4px; /* 滚动条的圆角 */
  }
}
.chapter-item {
  width: 306px;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-family: "sesb";
}
.chapter-item-active {
  color: $color3;
}
.tag-current {
  display: none;
}
.icon-ad-lock {
  @include icon(24px, 24px, "icon-camera.png");
  margin-left: auto;
}
.icon-lock {
  @include icon(24px, 24px, "icon-chapter-lock.png");
  margin-left: auto;
}

@media (max-width: 750px) {
  .chapter-container {
    width: 100%;
    height: vw(1000);
    box-shadow: none;
    border-radius: vw(48) vw(48) 0 0;
  }
  .chapter-header {
    height: vw(96);
    padding: 0 vw(46);
  }
  h3 {
    line-height: vw(48);
    font-size: vw(36);
  }
  .icon-close {
    @include icon(vw(48), vw(48), "icon-close-black.png");
    margin-left: auto;
  }

  .sort-row.chapter-item {
    display: flex;
    font-size: vw(24);
    line-height: vw(32);
    color: rgba($color2, 0.6);
  }

  $sortIcons: ("icon-sort-up", "icon-sort-down", "icon-sort-up-black", "icon-sort-down-black");
  @each $icon in $sortIcons {
    .#{$icon} {
      @include icon(vw(48), vw(48), "#{$icon}.png");
      margin-right: vw(16);
    }
  }

  .chapter-list {
    height: vw(800);
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .chapter-item {
    width: vw(658);
    height: vw(80);
    font-size: vw(28);
    border-bottom: 1px solid rgba($color2, 0.1);
  }
  .chapter-item-active {
    color: $color2;
    .icon-chapter-current {
      @include icon(vw(48), vw(48), "icon-chapter-current.png");
    }
  }
  .tag-current {
    display: block;
    width: vw(48);
    height: vw(48);
    margin-right: vw(16);
  }
  .icon-ad-lock,
  .icon-lock {
    width: vw(48);
    height: vw(48);
  }

  /* 黑色主题 */
  .chapter-container-dark {
    background: $color7;
    color: $color8;
    .icon-close {
      @include icon(vw(48), vw(48), "icon-close.png");
    }
    .sort-row {
      color: rgba($color8, 0.6);
    }
    .chapter-item {
      border-bottom: 1px solid rgba($color8, 0.1);
    }
    .chapter-item-active {
      color: $color8;
    }
  }
}
</style>
