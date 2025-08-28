<template>
  <main>
    <custom-read-header
      :is-show-back="isShowHeader"
      :current-chapter-detail="currentChapterDetail"
    />

    <!-- 小说内容 -->
    <module-read-content
      :current-chapter-detail="currentChapterDetail"
      :pre-chapter-item="preChapterItem"
      :next-chapter-item="nextChapterItem"
      :other-recommend-novel-detail="otherRecommendNovelDetail"
      @show-menu-setting="handleShowMenuSetting"
      @reload="getCurrentChapterDetail"
      @handle-get-reward="handleGetReward"
      @handle-click-next-chapter="handleClickNextChapter"
    />

    <module-read-reward ref="readReward" />

    <!-- <module-read-sidebar
      ref="readSidebar"
      :current-read-progress="currentReadProgress"
      @show-chapter-popup="handleShowChapterPopup"
      @hide-menu-setting="handleHideHeader"
      @hide-style-setting="handleHideHeader"
    /> -->
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
            @handle-click-next-chapter="handleClickNextChapter"
          />
        </transition>
      </div>
    </transition>

    <common-notification />
    <common-fixed-bottom />
  </main>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import Storage from "~/utils/storage";
import { generateCustomLink } from "@/utils/utils";

export default {
  data() {
    return {
      currentChapterDetail: null, // 当前阅读章节详情
      currentReadProgress: 0, // 当前阅读进度
      clickChapterId: 0, // 点击章节id
      isInitIncentiveAd: false, // 激励广告是否初始化
      preChapterItem: null, // 上一章节数据
      nextChapterItem: null, // 下一章节数据
      otherRecommendNovelDetail: null, // 其他推荐小说路径
      novelChapterList: [], // 章节列表
      isShowHeader: false,
      isShowChapterPopup: false // 移动端章节弹窗
    };
  },
  created() {
    if (process.client) {
      this.getCurrentChapterDetail();
    }
  },
  mounted() {},
  methods: {
    getUserId() {
      let userId = Storage.getItem("novel_userId");
      if (!userId) {
        userId = uuidv4().replace(/-/g, "");
        Storage.setItem("novel_userId", userId);
      }
      return userId;
    },
    async getCurrentChapterDetail() {
      const chapterId = this.$route.query.ch;
      const novelId = this.$route.params.read;
      const userId = this.getUserId();
      const novelDetail = await this.$axios.$post("/api/free_novel/novel_info", {
        site_id: process.env.SITE_ID,
        novel_id: Number(novelId),
        uid: userId
      });
      // 阅读历史与当前章节不一致，重定向
      if (Number(chapterId) !== novelDetail.user_last_read_chapter_id) {
        const updateUrl = generateCustomLink(
          `/read/${novelId}/?ch=${novelDetail.user_last_read_chapter_id}`
        );
        window.location.href = updateUrl;
        return;
      }

      this.novelChapterList = novelDetail.chapter;
      // 获取上一章和下一章
      this.getPreNextChapter();

      await this.$axios
        .$post("/api/free_novel/novel_chapter_content", {
          site_id: process.env.SITE_ID,
          chapter_id: Number(chapterId)
        })
        .then((response) => {
          const chapterDetail = response;
          // 初始化相关章节
          this.currentChapterDetail = chapterDetail;
          // 处理内容初始化后一些操作
          this.handleStartReadBook(chapterDetail);

          const readProgress = (chapterDetail.chapter_num / chapterDetail.novel_info.chapter) * 100;
          this.currentReadProgress =
            readProgress % 1 === 0 ? readProgress : readProgress.toFixed(1);

          // eslint-disable-next-line no-undef
          dataLayer.push({
            event: "Custom_Page_Content",
            novel_id: chapterDetail.novel_info.id,
            chapter_id: Number(chapterId)
          });
        });
    },

    // 设置用户阅读历史
    setUserNovelReadHistory(chapterDetail) {
      const currentChapterId = chapterDetail.chapter_id;
      const currentNovelId = chapterDetail.novel_info.id;
      const novelReadHistoryList = Storage.getItem("novel_readHistoryList") || [];
      const novelReadHistoryItem = novelReadHistoryList.find((item) => item.id === currentNovelId);
      if (novelReadHistoryItem) {
        const index = novelReadHistoryList.findIndex((item) => item.id === currentNovelId);
        novelReadHistoryList.splice(index, 1);
        novelReadHistoryItem.chapter_id = currentChapterId;
        novelReadHistoryList.unshift(novelReadHistoryItem);
      } else {
        novelReadHistoryList.unshift({ ...chapterDetail.novel_info, chapter_id: currentChapterId });
      }
      Storage.setItem("novel_readHistoryList", novelReadHistoryList);
    },
    // 获取上一章和下一章路径
    getPreNextChapter() {
      const chapterId = this.$route.query.ch;

      const currentChapterIndex = this.novelChapterList.findIndex(
        (chapter) => chapter.id === Number(chapterId)
      );
      this.preChapterItem =
        currentChapterIndex === 0 ? null : this.novelChapterList[currentChapterIndex - 1];
      // 最后一章
      if (currentChapterIndex === this.novelChapterList.length - 1) {
        this.getOtherRecommendNovel();
      }
      this.nextChapterItem =
        currentChapterIndex === this.novelChapterList.length - 1
          ? null
          : this.novelChapterList[currentChapterIndex + 1];
    },

    // 在阅读到最后一章，获取其他推荐小说（狼人题材）
    async getOtherRecommendNovel() {
      const novelReadHistoryList = Storage.getItem("novel_readHistoryList");
      const otherRecommendNovelResponse = await this.$axios.$post("/api/free_novel/novel_module", {
        site_id: process.env.SITE_ID,
        module_id: "all",
        page_size: 20,
        page: 1
      });
      const otherRecommendNovelList = otherRecommendNovelResponse.novel_list.filter(
        (novel) =>
          novel.category === "Werewolf" &&
          !(novelReadHistoryList && novelReadHistoryList.find((item) => item.id === novel.id))
      );
      if (otherRecommendNovelList.length !== 0) {
        const otherRecommendNovel =
          otherRecommendNovelList[Math.floor(Math.random() * otherRecommendNovelList.length)];

        const userId = this.getUserId();
        const otherRecommendNovelDetail = await this.$axios.$post("/api/free_novel/novel_info", {
          site_id: process.env.SITE_ID,
          novel_id: Number(otherRecommendNovel.id),
          uid: userId
        });
        this.otherRecommendNovelDetail = otherRecommendNovelDetail;
      }
    },

    // 点击下一章
    async handleClickNextChapter(chapterId) {
      const novelId = this.$route.params.read;
      const userId = this.getUserId();
      await this.$axios.$post("/api/free_novel/cnc", {
        site_id: process.env.SITE_ID,
        novel_id: Number(novelId),
        nchid: Number(chapterId),
        uid: userId
      });
    },

    /* 移动端操作 */
    // 展示菜单设置
    handleShowMenuSetting() {
      if (this.isShowHeader) {
        this.isShowHeader = false;
      } else {
        this.isShowHeader = true;
      }
      // if (this.$refs.readSidebar.isShowMenuSetting) {
      //   this.$refs.readSidebar.hideMenuSetting();
      //   this.isShowHeader = false;
      // } else {
      //   this.$refs.readSidebar.showMenuSetting();
      //   this.isShowHeader = true;
      //   window.setUserFirstAction("click_to_show_navbar");
      //   window.setUserReadPageClickAction("click_to_show_navbar");
      // }
    },
    handleShowChapterPopup() {
      this.isShowChapterPopup = true;
      document.body.classList.add("no-scroll");
      this.$nextTick(() => {
        this.$refs.mobileChapterPopup.scrollToActiveChapter();
      });
      window.setUserReadPageClickAction("click_chapter_list_button");
    },
    handleHideChapterPopup() {
      this.handleHideHeader();
      this.isShowChapterPopup = false;
      document.body.classList.remove("no-scroll");
    },
    // 关闭header，等同关闭所有弹窗
    handleHideHeader() {
      this.isShowHeader = false;
    },

    // 处理内容初始化后一些操作
    handleStartReadBook(chapterDetail) {
      // 记录阅读历史
      this.setUserNovelReadHistory(chapterDetail);
      // 阅读章节
      this.handleReadChapter();
      // 阅读时长计时器
      this.setReadTimer();

      // 记录用户首次进入小说详情页
      window.dataLayer.push({
        event: "Novel_detail_page",
        hi_ip: window.youknowwho_ip || "unknown"
      });
      // 记录用户阅读的章节
      const novelReadValue = `novel_${chapterDetail.novel_info.id}_chapter_${chapterDetail.chapter_num}`;
      window.dataLayer.push({
        event: "Novel_chapter_read",
        novel_read: novelReadValue
      });
      // 记录用户阅读章节数据
      window.setUserReadChapterData(chapterDetail.chapter_id);
      // 上报用户阅读章节数据到FaceBook
      window.setUserReadChapterToFaceBookData(chapterDetail.chapter_id);
      // 记录该章节是否是第一章
      window.isFirstChapterNum = chapterDetail.chapter_num === 1;
    },

    // 获取奖励
    handleGetReward() {
      this.$refs.readReward.setRewardTaskData("money");
    },
    // 阅读章节
    handleReadChapter() {
      this.$refs.readReward.setRewardTaskData("chapter");
    },
    // 阅读时长
    handleReadTime() {
      this.$refs.readReward.setRewardTaskData("time");
    },
    // 阅读计时器
    setReadTimer() {
      const _this = this;
      // 每一分钟计时一次
      this.readTimer = setInterval(() => {
        _this.handleReadTime();
      }, 60000);
      window.addEventListener("beforeunload", () => {
        clearInterval(this.readTimer);
      });
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
  /* 章节 */
  .chapter-list-popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
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

  .read-reward-box {
    right: vw(24);
    top: vw(18);
    gap: vw(16);
    height: vw(60);
    padding: 0 vw(18);
    border-radius: vw(60);
    border: vw(2) solid rgba($color_fff, 0.6);
    .icon-money {
      width: vw(40);
      height: vw(40);
    }
    .text-money {
      font-size: vw(28);
    }
    .btn-get {
      width: vw(64);
      height: vw(40);
      border-radius: vw(40);
      font-size: vw(26);
      &::after {
        top: vw(18);
        left: vw(14);
        width: vw(100);
        height: vw(100);
      }
      @keyframes handAnim {
        0% {
          transform: translate(vw(16), vw(16));
        }
      }
    }
  }
}
</style>
