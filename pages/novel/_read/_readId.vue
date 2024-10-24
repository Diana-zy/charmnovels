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
        <module-read-chapter ref="fixedChapterList" :chapters="novelChapterList" />
      </div>
    </section>

    <module-read-content
      :current-chapter-detail="currentChapterDetail"
      :all-apps="allApps"
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
            :chapters="novelChapterList"
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
  async asyncData({ $axios, params, env }) {
    try {
      console.log("Fetching data for readId page", params);
      const path = params.read;
      const lastDashIndex = path.lastIndexOf("-");
      const id = path.substring(lastDashIndex + 1, path.length);
      const [currentAppResponse, allAppsResponse] = await Promise.all([
        $axios.$get("/api/game/detail", {
          params: {
            site_id: env.SITE_ID,
            game_id: id
          }
        }),
        $axios.$get("/api/game/all_app", {
          params: {
            site_id: env.SITE_ID,
            size: 5,
            page: 1
          }
        })
      ]);
      return {
        currentApp: currentAppResponse,
        allApps: allAppsResponse.list
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  data() {
    return {
      currentChapterDetail: null, // 当前阅读章节详情
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
      await this.$axios
        .$post("/api/novel/novel_info", {
          site_id: process.env.SITE_ID,
          novel_id: Number(novelId)
        })
        .then((response) => {
          const novelDetail = response;
          this.novelChapterList = novelDetail.chapter;

          // // 有记录的章节，则跳转到记录的章节
          // if (novelDetail.user_last_read_chapter_num !== 0) {
          //   this.startReadPath = `/novel/${novelDetail.novel_info.id}/${this.novelDetail.user_last_read_chapter_id}/`;
          // }
          // // 没有记录的章节，则跳转到第一章节
          // else {
          //   this.startReadPath = `/novel/${novelDetail.novel_info.id}/${response.chapter[0].id}/`;
          // }
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
