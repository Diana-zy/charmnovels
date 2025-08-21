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
            canGetReward ? 'get-anima-hand' : 'btn-disable',
            isSuccessGetReward ? 'get-anima-reward' : ''
          ]"
          @click="handleGetReward"
          >{{ canGetReward ? "Get $1" : "End" }}</div
        >
      </div>
      <!-- 分页模块 -->
      <div class="pagination-box">
        <custom-link
          :to="preChapterPath"
          :class="['btn-change', 'btn-pre', { 'btn-disable': preChapterItem === null }]"
        >
          <i class="icon-prev"></i>
          <span>Previous Chapter</span>
        </custom-link>
        <custom-link
          :to="nextChapterPath"
          :class="['btn-change', 'btn-next', { 'btn-disable': nextChapterItem === null }]"
        >
          <span>Next Chapter</span>
          <i class="icon-next"></i>
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
    relatedChapterList: {
      type: Array,
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
    }
  },
  data() {
    return {
      isMobile: false,
      canGetReward: true, // 是否可以领取奖励
      isSuccessGetReward: false
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
        : `/read/${this.preChapterItem.novel_id}/?ch=${this.nextChapterItem.id}`;
    }
  },
  watch: {
    // 监听是否有数据，且只监听一次
    currentChapterDetail(newValue, oldValue) {
      if (newValue && oldValue === null) {
        this.$nextTick(() => {
          this.watchBookContentScroll();
          this.watchReaderScrollHeight();
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
  },
  methods: {
    initStorageReadSetting() {
      Storage.getItem("novel_cssReadFontSize") || Storage.setItem("novel_cssReadFontSize", 18);
      Storage.getItem("novel_cssReadFontSpace") || Storage.setItem("novel_cssReadFontSpace", 1.5);
      Storage.getItem("novel_cssReadBackgroundColor") ||
        Storage.setItem("novel_cssReadBackgroundColor", "#0f0f0f");
      Storage.getItem("novel_cssReadTextColor") ||
        Storage.setItem("novel_cssReadTextColor", "#eee");
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

        // console.log("admSlotOffsetTop", admSlotOffsetTop);
        // console.log("pageScrollTop", pageScrollTop);
        // console.log("window.AD_SHOW_SCROLL_TOP", window.AD_SHOW_SCROLL_TOP);

        // 获取header高度
        const headerHeight = document.querySelector(".read-header").offsetHeight;
        if (pageScrollTop >= admSlotOffsetTop - headerHeight) {
          event.stopPropagation();
          event.preventDefault();
          event.target.scrollTo(0, admSlotOffsetTop - headerHeight);
          this.previousScrollTop = pageScrollTop;
        }
      }
      // if (
      //   (this.watchReadChapter(event.target.scrollTop),
      //   window.__IS_SHOW_MASK__ &&
      //     (event.stopPropagation(),
      //     event.preventDefault(),
      //     event.target.scrollTo(0, window.___READ_MORE_TOP___)),
      //   !1 === window.___AD_SHOW_SCROLL___)
      // ) {
      //   const e = document.querySelector("." + window.___AD_SHOW_SCROLL_TOP___).offsetTop,
      //     o = event.target.scrollTop;
      //   o > this.previousScrollTop &&
      //     event.target.scrollTop >= e - 65 &&
      //     (event.stopPropagation(), event.preventDefault(), event.target.scrollTo(0, e - 65)),
      //     (this.previousScrollTop = o);
      // }
    },
    watchBookContentScroll() {
      document
        .getElementById("read-book-container")
        .addEventListener("scroll", this.watchBookContentScrollCallback);
    },
    watchReaderScrollHeight() {
      try {
        const container = document.getElementById("read-book-container");
        if (!container) {
          console.error('Element with ID "read-book-container" not found.');
          return;
        }

        new MutationObserver((mutationsList) => {
          for (const mutation of mutationsList) {
            if (mutation.type === "attributes" && mutation.attributeName === "style") {
              console.log("watchReaderScrollHeight", container.clientHeight);
              // 这里假设我们想要获取的是元素的高度变化
              // 如果只需要监听 style 变化而不做实际的高度计算或更新，可以根据实际需求调整
              this.innerHeight = container.clientHeight;
            }
          }
        }).observe(container, {
          attributes: true,
          attributeFilter: ["style"]
        });
      } catch (error) {
        console.error("Error setting up MutationObserver:", error);
      }
    },

    handleGetReward() {
      if (this.canGetReward) {
        this.canGetReward = false;
        this.isSuccessGetReward = true;
        this.$emit("handle-get-reward");
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
  font-family: serif;
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
  font-family: serif;
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
  .get-anima-hand {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 20px;
      left: 36px;
      @include icon(40px, 40px, "icon-hand.png");
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
}
.pagination-box {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  .btn-change {
    flex: 1;
    height: 40px;
    border-radius: 8px;
    background: rgba($color3, 0.2);
    color: $color3;
    font-size: 14px;
    font-family: "sesb";
    @include center;
    gap: 8px;
    .icon-prev,
    .icon-next {
      @include icon(24px, 24px, "icon-arrow-active.png");
    }
    .icon-next {
      transform: rotate(180deg);
    }
  }
  .btn-disable {
    background: #eeece8;
    color: #a8a8a8;
    .icon-prev,
    .icon-next {
      @include icon(24px, 24px, "icon-arrow-disable.png");
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
      padding: vw(16) 0 vw(32);
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
    .get-anima-hand {
      &::after {
        top: vw(30);
        left: vw(50);
        @include icon(vw(60), vw(60), "icon-hand.png");
      }
      @keyframes handAnim {
        0% {
          transform: translate(vw(20), vw(20));
        }
      }
    }
  }
  .pagination-box {
    margin: vw(32) 0 vw(200);
    gap: vw(32);
    .btn-change {
      height: vw(80);
      border-radius: vw(16);
      font-size: vw(28);
      gap: 0;
      .icon-prev,
      .icon-next {
        display: none;
      }
    }
    .btn-disable {
      .icon-prev,
      .icon-next {
        display: none;
      }
    }
  }
  .module-related-chapters-content {
    grid-template-columns: vw(658);
    gap: vw(32);
  }
}
</style>
