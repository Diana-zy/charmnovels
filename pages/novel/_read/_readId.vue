<template>
  <main>
    <custom-header :class="{ 'header-active': isShowHeader }" theme="dark" />

    <!-- PC端悬浮章节列表 -->
    <section class="fixed-bar">
      <div ref="fixedChapterBar" class="fixed-chapter" @click.stop="changeShowChapters">
        <i class="icon-chapter"></i>
        <span>Chapters</span>
      </div>
      <div v-show="isShowChapters" class="fixed-chapter-list">
        <module-read-chapter
          ref="fixedChapterList"
          :chapters="novelChapterList"
          :current-chapter-id="currentChapterDetail?.chapter_id"
          theme="dark"
        />
      </div>
    </section>

    <module-read-content
      :current-chapter-detail="currentChapterDetail"
      :pre-chapter-path="preChapterPath"
      :next-chapter-path="nextChapterPath"
      @show-menu-setting="handleShowMenuSetting"
    />
    <module-read-sidebar
      ref="readSidebar"
      @show-chapter-popup="handleShowChapterPopup"
      @hide-menu-setting="handleHideHeader"
      @hide-style-setting="handleHideHeader"
    />
    <!-- 移动端章节弹窗 -->
    <transition name="fade">
      <div v-show="isShowChapterPopup" class="chapter-list-popup">
        <div class="mask" @click="handleHideChapterPopup"></div>
        <transition name="slide">
          <module-read-chapter
            v-show="isShowChapterPopup"
            ref="mobileChapterPopup"
            :chapters="novelChapterList"
            :current-chapter-id="currentChapterDetail?.chapter_id"
            theme="dark"
            @close-chapter-popup="handleHideChapterPopup"
          />
        </transition>
      </div>
    </transition>

    <common-notification />
  </main>
</template>

<script>
export default {
  data() {
    return {
      currentChapterDetail: null, // 当前阅读章节详情
      preChapterPath: "#",
      nextChapterPath: "#",
      novelChapterList: [], // 章节列表
      isShowChapters: false, // PC端悬浮章节列表
      isShowHeader: false,
      isShowChapterPopup: false, // 移动端章节弹窗
      distanceFromTop: 0 // body距离顶部距离
    };
  },
  beforeMount() {
    this.getCurrentChapterDetail();
    this.getCurrentNovelDetail();
  },
  mounted() {
    document.addEventListener("click", this.handleUserClickEvent);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleUserClickEvent);
  },
  methods: {
    async getCurrentChapterDetail() {
      const chapterId = this.$route.params.readId;
      await this.$axios
        .$post("/api/novel/novel_chapter_content", {
          site_id: process.env.SITE_ID,
          chapter_id: Number(chapterId)
        })
        .then((response) => {
          const chapterDetail = response;
          this.currentChapterDetail = chapterDetail;
        });
    },
    async getCurrentNovelDetail() {
      const novelId = this.$route.params.read;
      const chapterId = this.$route.params.readId;
      await this.$axios
        .$post("/api/novel/novel_info", {
          site_id: process.env.SITE_ID,
          novel_id: Number(novelId)
        })
        .then((response) => {
          const novelDetail = response;
          this.novelChapterList = novelDetail.chapter;
          // 计算上一章和下一章路径
          const currentChapterIndex = novelDetail.chapter.findIndex(
            (chapter) => chapter.id === Number(chapterId)
          );
          this.preChapterPath =
            currentChapterIndex === 0
              ? "#"
              : `/novel/${novelId}/${this.novelChapterList[currentChapterIndex - 1].id}/`;
          this.nextChapterPath =
            currentChapterIndex === this.novelChapterList.length - 1
              ? "#"
              : `/novel/${novelId}/${this.novelChapterList[currentChapterIndex + 1].id}/`;
        });
    },
    changeShowChapters() {
      this.isShowChapters = !this.isShowChapters;
      if (this.isShowChapters) {
        this.$nextTick(() => {
          // 定位到当前阅读章节
          this.$refs.fixedChapterList.scrollToActiveChapter();
        });
      }
    },
    handleUserClickEvent(event) {
      const fixedChapterBar = this.$refs.fixedChapterBar;
      if (!fixedChapterBar.contains(event.target)) {
        this.isShowChapters = false;
      }
    },

    /* 移动端操作 */
    // 展示菜单设置
    handleShowMenuSetting() {
      this.$refs.readSidebar.showMenuSetting();
      this.isShowHeader = true;

      this.distanceFromTop = document.documentElement.scrollTop;
      document.body.classList.add("no-scroll");
      document.body.style.top = `-${this.distanceFromTop}px`;
    },
    handleShowChapterPopup() {
      this.isShowChapterPopup = true;
      this.$nextTick(() => {
        this.$refs.mobileChapterPopup.scrollToActiveChapter();
      });
    },
    handleHideChapterPopup() {
      this.handleHideHeader();
      this.isShowChapterPopup = false;
    },
    // 关闭header，等同关闭所有弹窗
    handleHideHeader() {
      this.isShowHeader = false;
      document.body.classList.remove("no-scroll");
      window.scrollTo(0, this.distanceFromTop); // 恢复滚动位置
    }
  }
};
</script>

<style scoped lang="scss">
.fixed-bar {
  position: fixed;
  top: 224px;
  left: 50%;
  z-index: 9;
  transform: translateX(-50%);
  width: 100%;
  max-width: 900px;
  @media screen and (max-width: 750px) {
    display: none;
  }
}
.fixed-chapter {
  position: absolute;
  top: 0;
  right: -109px;
  width: 94px;
  height: 64px;
  border-radius: 8px;
  background: $color3;
  @include center;
  flex-direction: column;
  font-size: 14px;
  line-height: 19px;
  color: $color1;
  font-family: "seb";
  cursor: pointer;
  z-index: 9;
  .icon-chapter {
    @include icon(24px, 24px, "icon-chapter.png");
  }
  @media screen and (max-width: 1170px) {
    right: 40px;
  }
}
.fixed-chapter-list {
  position: absolute;
  top: 0;
  right: 0;
  @media screen and (max-width: 1170px) {
    right: 149px;
  }
}

@media screen and (max-width: 750px) {
  main {
    padding-top: 0;
  }
  header {
    z-index: 11;
    transform: translate(-50%, -100%);
    transition: transform 0.2s;
  }
  .header-active {
    transform: translate(-50%, 0);
  }

  /* 章节 */
  .chapter-list-popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba($color6, 0.4);
    }
    .chapter-container {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
    }
  }
}
</style>
