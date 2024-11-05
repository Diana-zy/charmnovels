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
          :purchase-status="currentChapterDetail?.purchase_status"
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
      @reload="getCurrentChapterDetail"
    />
    <module-read-sidebar
      ref="readSidebar"
      :current-read-progress="currentReadProgress"
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
            :purchase-status="currentChapterDetail?.purchase_status"
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
import Storage from "~/utils/storage";
import { getQueryParam } from "~/utils/utils";

export default {
  data() {
    return {
      currentChapterDetail: null, // 当前阅读章节详情
      currentReadProgress: 0, // 当前阅读进度
      preChapterPath: "#",
      nextChapterPath: "#",
      novelChapterList: [], // 章节列表
      isShowChapters: false, // PC端悬浮章节列表
      isShowHeader: false,
      isShowChapterPopup: false, // 移动端章节弹窗
      distanceFromTop: 0 // body距离顶部距离
    };
  },
  created() {
    if (process.client) {
      if (getQueryParam("nov") && getQueryParam("pay_status") === "success") {
        this.confirmUnlockNovel();
      } else {
        this.getCurrentChapterDetail();
      }
      console.log("getQueryParam('pay_status'):", getQueryParam("pay_status"));
    }
  },
  mounted() {
    document.addEventListener("click", this.handleUserClickEvent);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleUserClickEvent);
  },
  methods: {
    async getCurrentChapterDetail() {
      const chapterId = this.$route.query.ch;
      await this.$axios
        .$post("/api/novel/novel_chapter_content", {
          site_id: process.env.SITE_ID,
          chapter_id: Number(chapterId)
        })
        .then((response) => {
          const chapterDetail = response;
          /* 登录过期 */
          if (!chapterDetail.is_login && Storage.getCookie("novel_token")) {
            this.$globalMethod.showDialog("Your session has expired. Please log in again.");
          }

          this.currentChapterDetail = chapterDetail;
          const readProgress = (chapterDetail.chapter_num / chapterDetail.novel_info.chapter) * 100;
          this.currentReadProgress =
            readProgress % 1 === 0 ? readProgress : readProgress.toFixed(1);

          this.getCurrentNovelDetail(chapterDetail.novel_info.id);
        });
    },
    async getCurrentNovelDetail(novelId) {
      const chapterId = this.$route.query.ch;
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
              : `/read/?ch=${this.novelChapterList[currentChapterIndex - 1].id}`;
          this.nextChapterPath =
            currentChapterIndex === this.novelChapterList.length - 1
              ? "#"
              : `/read/?ch=${this.novelChapterList[currentChapterIndex + 1].id}`;
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
    },
    async confirmUnlockNovel() {
      try {
        const res = await this.$axios.$post("/api/payment/confirm_unlock_novel", {
          site_id: process.env.SITE_ID,
          novel_id: getQueryParam("nov")
        });
        console.log(" response:", res);
      } catch (error) {
        console.log(" error:", error);
      }
      this.getCurrentChapterDetail();
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
