<!-- eslint-disable vue/no-v-html -->
<template>
  <section v-if="currentChapterDetail" id="read-book-container" class="read-container">
    <div v-if="isShowRewardTipGif" class="reward-tip-gif">
      <img
        src="@/assets/images/icon-gold-coin.png"
        alt="icon-gold-coin"
        class="left-icon animate-parabola"
      />
      <img
        src="@/assets/images/icon-gold-coin.png"
        alt="icon-gold-coin"
        class="right-icon animate-parabola"
      />
      <img src="@/assets/images/reward-tip.gif" alt="reward-tip" @load="onGifLoad" />
    </div>
    <!-- 第一章节才展示 top-info-->
    <div v-if="currentChapterDetail.chapter_num === 1" class="top-info">
      <div class="cover">
        <nuxt-img
          :src="currentChapterDetail.novel_info.cover"
          :alt="currentChapterDetail.novel_info.name"
          width="200"
          height="300"
          format="auto"
          fit="cover"
        />
      </div>
      <p class="name">{{ currentChapterDetail.novel_info.name }}</p>
      <span class="author">{{ currentChapterDetail.novel_info.author }}</span>
    </div>
    <!-- 文章内容模块 -->
    <article class="read-content" @click="handleShowMenuSetting">
      <h3
        >Chapter {{ currentChapterDetail.chapter_num }} {{ currentChapterDetail.chapter_name }}
      </h3>
      <read-content-with-ad :content="currentChapterDetail.content" />
    </article>

    <section class="bottom-operation">
      <!-- 分页模块 -->
      <div class="pagination-box">
        <custom-link v-if="preChapterItem !== null" :to="preChapterPath" class="btn-pre">
          Previous Chapter
        </custom-link>
        <custom-link
          ref="nextChapterLinkRef"
          :to="nextChapterItem === null ? otherRecommendNovelPath : nextChapterPath"
          class="btn-next"
          @click.native="handleClickNextChapter"
        >
          <span>{{ nextChapterItem === null ? "Read More" : "Next Chapter" }}</span>
        </custom-link>
      </div>
    </section>
  </section>
</template>

<script>
import Storage from "@/utils/storage";
export default {
  props: {
    currentChapterDetail: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Object | null,
      required: true
    },
    preChapterItem: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Object | null,
      required: true
    },
    nextChapterItem: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Object | null,
      required: true
    },
    otherRecommendNovelDetail: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Object | null,
      required: true
    }
  },
  data() {
    return {
      isMobile: false,
      canGetReward: true, // 是否可以领取奖励
      isSuccessGetReward: false, // 是否成功领取奖励
      isRequestRewardAdLoading: false, // 是否正在请求奖励广告
      isSecondRequestRewardAd: false, // 是否二次请求奖励广告
      isShowPagination: false,
      isShowGifTimeout: false
    };
  },
  computed: {
    preChapterPath() {
      return this.preChapterItem === null
        ? "#"
        : `/read/${this.preChapterItem.novel_id}/?ch=${this.preChapterItem.id}`;
    },
    nextChapterPath() {
      return this.nextChapterItem === null
        ? "#"
        : `/read/${this.nextChapterItem.novel_id}/?ch=${this.nextChapterItem.id}`;
    },
    otherRecommendNovelPath() {
      return this.otherRecommendNovelDetail === null
        ? "/"
        : `/read/${this.otherRecommendNovelDetail.novel_info.id}/?ch=${this.otherRecommendNovelDetail.user_last_read_chapter_id}`;
    },
    isShowRewardTipGif() {
      return this.currentChapterDetail?.chapter_num === 2 && this.isShowGifTimeout;
    }
  },
  watch: {
    // 监听是否有数据，且只监听一次
    currentChapterDetail(newValue, oldValue) {
      if (newValue && oldValue === null) {
        this.$nextTick(() => {
          this.watchBookContentScroll();
        });
      }
    },
    // 监听激励广告提示gif展示
    isShowRewardTipGif(newValue, oldValue) {
      if (oldValue === false && newValue === true) {
        window.setUserShowGifTimeOut();
        // gif展示上报Gtm
        window.setUserReadPageClickActionNew("reward_gif_show");
      }
    }
  },
  mounted() {
    this.initIsShowGifTimeout();

    this.isMobile = window.innerWidth <= 750;
    this.initStorageReadSetting();

    const root = document.documentElement;
    root.style.setProperty("--read-font-size", Storage.getItem("novel_cssReadFontSize") + "px");
    root.style.setProperty("--read-font-space", Storage.getItem("novel_cssReadFontSpace"));
    root.style.setProperty("--read-bg-color", Storage.getItem("novel_cssReadBackgroundColor"));
    root.style.setProperty("--read-text-color", Storage.getItem("novel_cssReadTextColor"));

    // 页面卸载移除激励定时器
    window.addEventListener("beforeunload", () => {
      this.rewardTimer && clearTimeout(this.rewardTimer);
    });
  },
  methods: {
    initStorageReadSetting() {
      Storage.getItem("novel_cssReadFontSize") || Storage.setItem("novel_cssReadFontSize", 18);
      Storage.getItem("novel_cssReadFontSpace") || Storage.setItem("novel_cssReadFontSpace", 1.5);
      Storage.getItem("novel_cssReadBackgroundColor") ||
        Storage.setItem("novel_cssReadBackgroundColor", "#0f0f0f");
      Storage.getItem("novel_cssReadTextColor") ||
        Storage.setItem("novel_cssReadTextColor", "#c8c8c8");
      Storage.getItem("novel_cssReadLastTheme") ||
        Storage.setItem("novel_cssReadLastTheme", "dark");
    },

    onGifLoad() {
      setTimeout(() => {
        this.isShowGifTimeout = false;
        const eventGifHide = new Event("eventGifHide");
        window.dispatchEvent(eventGifHide);
      }, 2000);
    },

    initIsShowGifTimeout() {
      if (!window.getUserShowGifTimeOut()) {
        this.isShowGifTimeout = true;
      }
    },

    handleShowMenuSetting() {
      this.$emit("show-menu-setting");
    },

    /* 处理页内滚动 */
    watchBookContentScrollCallback(event) {
      // 获取最后一个页内广告
      const lastPageAdElement = document.querySelector(".adm-slot-detail_2");
      const lastPageAdElementTop = lastPageAdElement.offsetTop;
      const lastPageAdElementHeight = lastPageAdElement.offsetHeight;

      const scrollContentHeight = event.target.scrollHeight;
      const clientHeight = event.target.clientHeight;
      const scrollTop = event.target.scrollTop;
      // 判断是否观看完最后一个页内广告后且滑动了1个屏幕高度
      const isReadLastPageAd =
        scrollTop > lastPageAdElementTop + lastPageAdElementHeight + clientHeight;
      // 判断滚动到底部还有半个屏幕高度
      const isArriveBottom = scrollContentHeight - clientHeight - scrollTop < clientHeight / 2;
      if (isReadLastPageAd || isArriveBottom) {
        this.isShowPagination = true;
      } else {
        this.isShowPagination = false;
      }

      if (window.AD_SHOW_SCROLL === false) {
        const admSlotOffsetTop = document.querySelector("." + window.AD_SHOW_SCROLL_TOP).offsetTop;
        const pageScrollTop = event.target.scrollTop;

        const headerHeight = document.querySelector(".read-header").offsetHeight;
        if (pageScrollTop >= admSlotOffsetTop - headerHeight) {
          event.stopPropagation();
          event.preventDefault();
          event.target.scrollTo(0, admSlotOffsetTop - headerHeight);
        }
      }
    },
    watchBookContentScroll() {
      document
        .getElementById("read-book-container")
        .addEventListener("scroll", this.watchBookContentScrollCallback);
    },

    handleClickNextChapter() {
      if (this.nextChapterItem !== null) {
        this.$emit("handle-click-next-chapter", this.nextChapterItem.id);

        // 点击下一章
        window.dataLayer.push({ event: "Next_chapter_click", button_type: "bottom_button" });
        window.trackEventToPixel("Next_chapter_click");
        window.trackEventToPixel("Next_chapter_click", false);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.read-container {
  width: 100%;
  max-width: 900px;
  margin: 32px auto 32px;
  padding: 0 30px 40px;
  background: #fffefc;
  box-shadow: 0 0 11px 0 rgba($color6, 0.06);
  border-radius: 2px;
  overflow-y: scroll;
  height: 87vh;
}
.reward-tip-gif {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  @include center;
  img {
    width: 300px;
    height: 300px;
  }
}

.top-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid rgba($color2, 0.1);
}
.cover {
  width: 200px;
  height: 300px;
  margin-top: 24px;
  box-shadow: 0 4px 32px 0 rgba($color6, 0.09);
  border-radius: 2px;
  overflow: hidden;
  @include book-edge(4.04px, 6px);
  img {
    width: 100%;
    height: 100%;
  }
}
.name {
  width: 610px;
  font-size: 30px;
  line-height: 40px;
  margin: 8px 0 16px;
  text-align: center;
  @include ellipsis(2);
}
.author {
  font-size: 16px;
  line-height: 21px;
  margin-bottom: 21px;
  opacity: 0.6;
}
.read-content {
  h3 {
    font-size: 20px;
    line-height: 26px;
    padding: 24px 0 16px;
  }
  div {
    font-size: 16px;
    line-height: 26px;
  }
}
.content-text {
  ::v-deep .br {
    height: 16px;
  }
  ::v-deep .adm-slot {
    margin-top: 16px;
  }
}

.ad-1 {
  margin: 0 auto 16px;
}
.bottom-operation {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  width: 520px;
}

.pagination-box {
  display: flex;
  gap: 24px;
  .btn-next,
  .btn-pre {
    &::after {
      content: "";
      position: absolute;
      z-index: -1;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: calc(100% + 10px);
      height: calc(100% + 10px);
      border-radius: inherit;
      background-color: rgba($color3, 0.2);
    }
    position: relative;
    flex: 1;
    @include center;
    height: 60px;
    border-radius: 60px;
    background-color: $color3;
    color: $color_fff;
    font-size: 26px;
    font-family: "sesb";
  }
  .btn-next {
    background-color: #f96606;
  }
  .btn-pre {
    background-color: #fd944f;
  }
}
.module-related-chapters-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(412px, 1fr));
  gap: 16px;
}

@media screen and (max-width: 750px) {
  .read-container {
    max-width: unset;
    height: calc(100dvh - vw(96));
    margin: 0;
    padding: 0 vw(46) vw(180);
    background: var(--read-bg-color);
    color: var(--read-text-color);
    box-shadow: none;
    border-radius: 0;
  }
  .reward-tip-gif {
    img {
      width: vw(400);
      height: vw(400);
    }
    .left-icon,
    .right-icon {
      position: absolute;
      width: vw(50);
      height: vw(50);
      z-index: 1;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 1;
    }
    // 抛物线动画类
    .animate-parabola {
      animation-duration: 1.5s;
      animation-fill-mode: forwards;
      animation-timing-function: ease-out-quart;
    }

    // 左侧图标向左上角运动
    .left-icon.animate-parabola {
      animation-name: parabola-left;
    }

    // 右侧图标向右上角运动
    .right-icon.animate-parabola {
      animation-name: parabola-right;
    }

    // 左侧图标抛物线动画（向左上角）
    @keyframes parabola-left {
      0% {
        transform: translate(-50%, -50%);
        opacity: 1;
      }

      80% {
        opacity: 0.7;
      }

      100% {
        transform: translate(-600%, -1000%);
        opacity: 0;
      }
    }

    // 右侧图标抛物线动画（向右上角）
    @keyframes parabola-right {
      0% {
        transform: translate(-50%, -50%);
        opacity: 1;
      }
      80% {
        opacity: 0.7;
      }
      100% {
        transform: translate(550%, -1580%);
        opacity: 0;
      }
    }
  }
  .top-info {
    border: none;
    align-items: flex-start;
  }
  .cover {
    display: none;
  }
  .name {
    width: 100%;
    font-size: vw(48);
    line-height: vw(64);
    margin: 0 0 vw(16);
    text-align: left;
  }
  .author {
    font-size: vw(32);
    line-height: vw(42);
    margin-bottom: 0;
  }
  .read-content {
    h3 {
      font-size: vw(40);
      line-height: vw(54);
      padding: vw(16) 0;
    }
    div {
      font-size: vw(36);
      line-height: vw(48);
    }
  }
  .content-text {
    ::v-deep .br {
      height: vw(24);
    }
    ::v-deep .adm-slot {
      margin-top: vw(24);
    }
  }

  .ad-1 {
    margin-top: vw(32);
  }
  .bottom-operation {
    width: vw(658);
    bottom: vw(64);
  }

  .pagination-box {
    gap: vw(40);
    .btn-next,
    .btn-pre {
      &::after {
        width: calc(100% + vw(12));
        height: calc(100% + vw(12));
      }
      height: vw(84);
      border-radius: vw(84);
      font-size: vw(28);
    }
  }
  .module-related-chapters-content {
    grid-template-columns: vw(658);
    gap: vw(32);
  }
}
</style>
