<!-- eslint-disable vue/no-v-html -->
<template>
  <section v-if="currentChapterDetail" id="read-book-container" class="read-container">
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

    <transition name="fade">
      <section v-show="isShowPagination" class="bottom-operation">
        <transition name="slide">
          <!-- 分页模块 -->
          <div v-show="isShowPagination" class="pagination-box">
            <div class="next-chapter-box">
              <custom-link
                ref="nextChapterLinkRef"
                :to="nextChapterItem === null ? otherRecommendNovelPath : nextChapterPath"
                class="btn-next"
                @click.native="handleClickNextChapter"
              >
                <span>{{ nextChapterItem === null ? "Read More" : "Next Chapter" }}</span>
              </custom-link>
            </div>

            <custom-link v-if="preChapterItem !== null" :to="preChapterPath" class="btn-pre">
              Previous Chapter
            </custom-link>
          </div>
        </transition>
      </section>
    </transition>
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
      isShowPagination: false
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
    }
  },
  mounted() {
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
        window.dataLayer.push({ event: "Next_chapter_click" });
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
  flex-direction: column;
  gap: 16px;
  .btn-next {
    @include center;
    width: 100%;
    height: 80px;
    border-radius: 8px;
    background-color: $color3;
    color: $color_fff;
    font-size: 28px;
    font-family: "sesb";
  }
  .btn-pre {
    text-align: center;
    color: #a8a8a8;
    font-size: 18px;
    text-decoration: underline;
  }
  .btn-disable {
    background: #eeece8;
    color: #a8a8a8;
  }

  .next-chapter-box {
    position: relative;
    flex: 1;
    cursor: pointer;
  }
  .reward-ad-mask {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
  }

  .get-anima-hand {
    &::after {
      content: "";
      position: absolute;
      top: 40px;
      left: 50%;
      @include icon(50px, 50px, "icon-hand.png");
      animation: handAnim 0.4s linear infinite alternate;
    }
    @keyframes handAnim {
      0% {
        transform: translate(12px, 12px);
      }
      100% {
        transform: translate(0);
      }
    }
  }

  .reward-ad-loading {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    @include center;
    background: rgba(#000, 0.6);
    &::after {
      content: "";
      position: absolute;
      border: 4px solid rgba(#fff, 0.8);
      border-left-color: transparent;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      animation: loadingAnim 1s linear infinite;
    }
    @keyframes loadingAnim {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
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
    padding: 0 vw(46) vw(48);
    background: var(--read-bg-color);
    color: var(--read-text-color);
    box-shadow: none;
    border-radius: 0;
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
    bottom: vw(32);
  }

  .pagination-box {
    gap: vw(32);
    .btn-next {
      height: vw(124);
      border-radius: vw(16);
      font-size: vw(46);
    }
    .btn-pre {
      font-size: vw(32);
    }

    .get-anima-hand {
      &::after {
        top: vw(60);
        left: vw(330);
        @include icon(vw(80), vw(80), "icon-hand.png");
      }
      @keyframes handAnim {
        0% {
          transform: translate(vw(20), vw(20));
        }
      }
    }
    .reward-ad-loading {
      border-radius: vw(16);
      &::after {
        content: "";
        border: vw(10) solid rgba(#fff, 0.8);
        border-left-color: transparent;
        width: vw(70);
        height: vw(70);
        animation: loadingAnim 1s linear infinite;
      }
      @keyframes loadingAnim {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }
  }
  .module-related-chapters-content {
    grid-template-columns: vw(658);
    gap: vw(32);
  }
}
</style>
