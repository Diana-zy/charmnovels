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

    <section class="bottom-operation">
      <!-- 奖励模块 -->
      <div class="get-reward-box">
        <div class="content-left">
          <img src="~/assets/images/icon-money.png" alt="icon-money" />
          <div>
            Reading Reward $1
            <div class="content-left-num">$1</div>
          </div>
        </div>
        <div
          :class="[
            'btn-get-reward',
            canGetReward ? '' : 'btn-disable',
            isSuccessGetReward ? 'get-anima-reward' : ''
          ]"
          @click="handleGetReward"
          >{{ canGetReward ? "Get $1" : "End" }}</div
        >
      </div>
      <!-- 分页模块 -->
      <div class="pagination-box">
        <p class="tip-desc">Complete ads to get extra $1! </p>

        <div class="next-chapter-box">
          <div
            class="reward-ad-mask"
            :class="[isRequestRewardAdLoading ? '' : 'get-anima-hand']"
            @click="handleOpenRewardAd"
          >
            <div v-if="isRequestRewardAdLoading" class="reward-ad-loading"></div>
          </div>
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
      isSecondRequestRewardAd: false // 是否二次请求奖励广告
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

    handleGetReward() {
      if (this.canGetReward) {
        this.canGetReward = false;
        this.isSuccessGetReward = true;
        this.$emit("handle-get-reward");
        window.setUserReadPageClickAction("click_bottom_money_button");
      }
    },

    handleOpenRewardAd() {
      if (this.isRequestRewardAdLoading) {
        return;
      }
      this.isRequestRewardAdLoading = true;
      const adConfig = {
        google_ad_loaded_callback: (adInstance) => {
          if (adInstance !== null) {
            window.dataLayer.push({
              event: "Ads_IR",
              Ads_IR: "C_IR"
            });
            this.handleWatchRewardTime();
            adInstance.show((result) => {
              clearTimeout(this.rewardTimer);
              if (result.status === "viewed") {
                window.dataLayer.push({
                  event: "Ads_IR",
                  Ads_IR: "V_IR"
                });
                this.handleSimulationClickNextChapter();
                window.trackEventToPixel("V_IR");
              }
            });
          } else {
            console.log("No rewarded ad loaded");
            // 第一次请求失败给个提示
            if (this.isSecondRequestRewardAd === false) {
              this.isSecondRequestRewardAd = true;
              this.$globalMethod.showNotification({
                message: "NetWork Error, Please try again later",
                type: "warning"
              });
            } else {
              this.handleSimulationClickNextChapter();
            }
          }
          this.isRequestRewardAdLoading = false;
        },
        google_ad_slot: 6875183545,
        google_ad_format: "rewarded"
      };

      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({
        params: adConfig
      });
      window.dataLayer.push({
        event: "Ads_IR",
        Ads_IR: "Q_IR"
      });

      // 点击下一章
      window.dataLayer.push({ event: "Next_chapter_click" });
      window.trackEventToPixel("Next_chapter_click");
      window.trackEventToPixel("Next_chapter_click", false);
    },

    handleWatchRewardTime() {
      this.rewardTimer && clearTimeout(this.rewardTimer);
      this.rewardTimer = setTimeout(() => {
        window.dataLayer.push({
          event: "Ads_IR",
          Ads_IR: "V_IR_5S"
        });
        clearTimeout(this.rewardTimer);
      }, 5000);
    },

    handleSimulationClickNextChapter() {
      this.$nextTick(() => {
        this.$refs.nextChapterLinkRef.$el.click();
      });
    },

    handleClickNextChapter() {
      if (this.nextChapterItem !== null) {
        this.$emit("handle-click-next-chapter", this.nextChapterItem.id);
        // 点击进入下一章节
        // window.dataLayer.push({ event: "Next_chapter_click" });
        // window.trackEventToPixel("Next_chapter_click");
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
  margin-top: 16px;
}
.pay-box {
  width: 100%;
  height: 64px;
  border-radius: 8px;
  background: $color3;
  @include center;
  flex-direction: column;
  cursor: pointer;
  .icon-lock {
    @include icon(24px, 24px, "icon-lock.png");
    margin-right: 4px;
  }
  .row-status {
    font-size: 18px;
    line-height: 24px;
    margin-bottom: 4px;
    color: $color1;
    font-family: "seb";
    @include center;
  }
  .row-info {
    font-size: 14px;
    line-height: 19px;
    color: $color1;
    :nth-child(1) {
      font-family: "seb";
      margin-right: 4px;
    }
  }
}
.status-paid {
  font-size: 14px;
  line-height: 19px;
  color: $color3;
  text-align: center;
  text-decoration: underline;
  margin-top: 8px;
  cursor: pointer;
}
.get-reward-box {
  display: flex;
  align-items: center;
  width: 450px;
  height: 80px;
  margin: 32px auto;
  padding: 0 16px;
  border-radius: 8px;
  background: #fff4e4;
  img {
    width: 70px;
    height: 70px;
    margin-right: 12px;
  }
  .content-left {
    display: flex;
    align-items: center;
    color: #98650e;
    font-size: 24px;
    line-height: 32px;
  }
  .content-left-num {
    width: 50px;
    text-align: center;
    font-size: 20px;
    line-height: 24px;
    border-radius: 4px;
    background-color: rgba($color_fff, 0.6);
  }
  .btn-get-reward {
    @include center;
    width: 86px;
    height: 36px;
    margin-left: auto;
    border-radius: 36px;
    background-color: $color3;
    color: $color_fff;
    font-family: "sesb";
    font-size: 18px;
    cursor: pointer;
    &.btn-disable {
      background-color: rgba($color3, 0.6);
      color: rgba($color_fff, 0.8);
    }
  }
  .get-anima-reward {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: -4px;
      left: 18px;
      @include icon(40px, 40px, "icon-money.png");
      animation: getRewardAnima 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
    }
    @keyframes getRewardAnima {
      0% {
        transform: translateY(0) translateX(0);
        opacity: 1;
      }
      100% {
        transform: translateY(-100dvh) translateX(0);
        opacity: 0;
      }
    }
  }
}
.pagination-box {
  margin-top: 64px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  .tip-desc {
    color: $color3;
    text-align: center;
  }
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
    font-size: vw(64);
    line-height: vw(76);
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
      font-size: vw(58);
      line-height: vw(76);
      padding: vw(16) 0;
    }
    div {
      font-size: vw(50);
      line-height: vw(68);
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
    margin-top: vw(32);
  }
  .pay-box {
    height: vw(128);
    border-radius: vw(16);
    .icon-lock {
      width: vw(48);
      height: vw(48);
      margin-right: vw(8);
    }
    .row-status {
      font-size: vw(36);
      line-height: vw(48);
      margin-bottom: vw(8);
    }
    .row-info {
      font-size: vw(28);
      line-height: vw(38);
      :nth-child(1) {
        margin-right: vw(8);
      }
    }
  }
  .status-paid {
    font-size: vw(28);
    line-height: vw(38);
    margin-top: vw(16);
  }
  .get-reward-box {
    width: 100%;
    height: vw(124);
    margin: vw(46) auto vw(64);
    padding: 0 vw(24);
    border-radius: vw(16);
    img {
      width: vw(100);
      height: vw(100);
      margin-right: vw(18);
    }
    .content-left {
      font-size: vw(38);
      line-height: vw(54);
    }
    .content-left-num {
      width: vw(88);
      font-size: vw(32);
      line-height: vw(40);
      border-radius: vw(12);
    }
    .btn-get-reward {
      width: vw(132);
      height: vw(52);
      border-radius: vw(52);
      font-size: vw(32);
    }
    .get-anima-reward {
      &::before {
        width: vw(50);
        height: vw(50);
        top: 0;
        left: vw(40);
      }
    }
  }
  .pagination-box {
    margin: vw(156) 0 vw(200);
    gap: vw(32);
    .tip-desc {
      font-size: vw(28);
      line-height: vw(36);
    }
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
