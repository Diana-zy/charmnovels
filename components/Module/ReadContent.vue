<!-- eslint-disable vue/no-v-html -->
<template>
  <section v-if="currentChapterDetail" class="read-container">
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
      <p ref="contentTextRef" class="content-text" v-html="chapterContent"></p>
    </article>

    <!-- PC端未解锁状态隐藏该位置广告 -->
    <google-ad-small
      v-if="
        currentChapterDetail.purchase_status == 2 ||
        currentChapterDetail.chapter_num <= 8 ||
        isMobile
      "
      class="ad-1"
      ad-slot="7793230426"
    />

    <section class="bottom-operation">
      <!-- 支付模块 -->
      <div
        v-if="currentChapterDetail.purchase_status !== 2 && currentChapterDetail.chapter_num > 8"
        class="pay-box"
        @click="createPaymentOrder(currentChapterDetail.purchase_status)"
      >
        <div class="row-status">
          <i class="icon-lock"></i>
          <span>Unlock</span>
        </div>
        <div class="row-info">
          <span v-if="currentChapterDetail.purchase_status !== 1"
            >${{ currentChapterDetail.novel_info.price }}</span
          >
          <span>{{
            currentChapterDetail.purchase_status === 1
              ? "Continue payment"
              : "Enjoy reading this novel"
          }}</span>
        </div>
      </div>
      <div
        v-if="currentChapterDetail.purchase_status === 1 && currentChapterDetail.chapter_num > 8"
        class="status-paid"
        @click="getOrderUnlockStatus"
      >
        Paid(Not unlocked)</div
      >
      <!-- 分页模块 -->
      <div class="pagination-box">
        <custom-link
          :to="preChapterPath"
          :class="['btn-change', 'btn-pre', { 'btn-disable': preChapterPath === '#' }]"
        >
          <i class="icon-prev"></i>
          <span>Previous Chapter</span>
        </custom-link>
        <custom-link
          :to="nextChapterPath"
          :class="['btn-change', 'btn-next', { 'btn-disable': nextChapterPath === '#' }]"
        >
          <span>Next Chapter</span>
          <i class="icon-next"></i>
        </custom-link>
      </div>
    </section>
    <!-- 相关章节模块 -->
    <section v-if="currentChapterDetail.chapter.length !== 0" class="module-related-chapters">
      <common-title-label title="Related Chapters" />
      <div class="module-related-chapters-content">
        <item-module-related-chapter
          v-for="(item, i) in currentChapterDetail.chapter"
          :key="i"
          :item="item"
          :to="`/read/?ch=${item.id}`"
        />
      </div>
    </section>
    <common-loading-max v-if="loading" />
  </section>
</template>

<script>
import Vue from "vue";
import Storage from "@/utils/storage";
import googleAd from "@/components/GoogleAd";
import googleAdPreload from "@/components/GoogleAdPreload";
import googleAdSmall from "@/components/GoogleAdSmall";
export default {
  props: {
    currentChapterDetail: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Object | null,
      required: true
    },
    preChapterPath: {
      type: String,
      default: "#"
    },
    nextChapterPath: {
      type: String,
      default: "#"
    }
  },
  data() {
    return {
      loading: false,
      isMobile: false,
      firstTagCount: 30, // 首次广告展示的字数位置
      followingTagCount: 1200, // 后续广告展示的字数间隔
      currentTagIndex: 0 // 当前广告展示的字数位置
    };
  },
  computed: {
    chapterContent() {
      let content = this.currentChapterDetail?.content;
      content = content?.replace(/\n/g, "<p class='br'></p>");
      return content;
    }
  },
  watch: {
    chapterContent(newContent) {
      if (newContent) {
        this.$nextTick(() => {
          const cut30pTags = this.getContentPTagesToLength(30);
          if (cut30pTags) {
            this.insertContentAd(cut30pTags, "content-ad-1", "page", "7045171250", true);
          }

          // 免费章节或解锁章节，插入中间段落广告
          if (
            this.currentChapterDetail.purchase_status === 2 ||
            this.currentChapterDetail.chapter_num <= 8
          ) {
            this.createCountPTagsAd();
          }
        });
      }
    }
  },
  mounted() {
    this.isMobile = window.innerWidth <= 750;
    this.initStorageReadSetting();

    const root = document.documentElement;
    root.style.setProperty("--read-font-size", Storage.getCookie("novel_cssReadFontSize") + "px");
    root.style.setProperty("--read-font-space", Storage.getCookie("novel_cssReadFontSpace"));
    root.style.setProperty("--read-bg-color", Storage.getCookie("novel_cssReadBackgroundColor"));
    root.style.setProperty("--read-text-color", Storage.getCookie("novel_cssReadTextColor"));
  },
  methods: {
    initStorageReadSetting() {
      Storage.getCookie("novel_cssReadFontSize") || Storage.setCookie("novel_cssReadFontSize", 18);
      Storage.getCookie("novel_cssReadFontSpace") ||
        Storage.setCookie("novel_cssReadFontSpace", 1.5);
      Storage.getCookie("novel_cssReadBackgroundColor") ||
        Storage.setCookie("novel_cssReadBackgroundColor", "#fffcf7");
      Storage.getCookie("novel_cssReadTextColor") ||
        Storage.setCookie("novel_cssReadTextColor", "#41414c");
      Storage.getCookie("novel_cssReadLastTheme") ||
        Storage.setCookie("novel_cssReadLastTheme", "light");
    },

    // 获取指定字符长度后的第一个p标签
    getContentPTagesToLength(length) {
      const contentTextRef = this.$refs.contentTextRef;
      // 获取所有p标签
      const allParagraph = contentTextRef.querySelectorAll("p");
      const contentText = this.currentChapterDetail.content;
      /* 与最后一个广告留出间隔 */
      if (contentText.length - this.followingTagCount > length) {
        const cutContentText = contentText.slice(0, length);
        // 截取的字符串中p标签数量
        const pTagsLengthInCutContentText = (cutContentText.match(/\n/g) || []).length;
        // 截取的字符串中的p标签数量等于全文p标签数量
        if (pTagsLengthInCutContentText === allParagraph.length) {
          return null;
        } else {
          return allParagraph[pTagsLengthInCutContentText];
        }
      }
      // 字符数不足
      else {
        return null;
      }
    },

    // 动态添加广告
    insertContentAd(markEl, className, adType = "page", adSlot, isPreload = false) {
      const componentInstance = new (Vue.extend(isPreload ? googleAdPreload : googleAdSmall))({
        propsData: {
          adSlot,
          adType
        }
      });
      componentInstance.$mount();
      componentInstance.$el?.classList.add(className);
      markEl.insertAdjacentElement("afterend", componentInstance.$el);
    },

    createCountPTagsAd() {
      this.currentTagIndex++;
      console.log("currentTagIndex:", this.currentTagIndex);
      const cutTextCountPTags = this.getContentPTagesToLength(
        this.currentTagIndex * this.followingTagCount + this.firstTagCount
      );

      // 可填充且广告数量不超过9
      if (cutTextCountPTags && this.currentTagIndex <= 9) {
        const adSlotArr = [
          "7313227898", // page-1
          "6438397404", // inline-1
          "8678382087", // multiple-1
          "4933744044", // page-2
          "5070207930", // inline-2
          "4196211590", // multiple-2
          "8770052860", // page-3
          "2224552749", // inline-3
          "6246825718" // multiple-3
        ];
        const adTypeArr = ["page", "inline", "multiple"];
        const adType = adTypeArr[(this.currentTagIndex - 1) % 3]; // ["page","inline","multiple"]
        this.insertContentAd(
          cutTextCountPTags,
          "content-ad-follow",
          adType,
          adSlotArr[this.currentTagIndex - 1]
        );
        this.createCountPTagsAd();
      }
    },

    // 创建or支付订单
    createPaymentOrder(purchaseStatus) {
      if (!Storage.getCookie("novel_token")) {
        this.$globalMethod.showDialog("Your account is not logged in, please log in.");
        return;
      }

      if (purchaseStatus === 0) {
        // 创建新订单
        this.unlockNovel();
      } else if (purchaseStatus === 1) {
        // 继续支付
        this.confirmUnlockNovel();
      }
    },
    // 获取订单解锁状态
    getOrderUnlockStatus() {
      // 调用接口获取订单解锁状态
      this.confirmUnlockNovel();
    },
    handleShowMenuSetting() {
      this.$emit("show-menu-setting");
    },
    async unlockNovel() {
      this.loading = true;
      // 调用接口解锁小说
      try {
        const res = await this.$axios.$post("/api/payment/unlock_novel", {
          site_id: process.env.SITE_ID,
          novel_id: this.currentChapterDetail.novel_info.id,
          redirect_url: `${window.location.href}&nov=${this.currentChapterDetail.novel_info.id}`
        });
        console.log(" response:", res);
        window.location.href = res.order_info.url;
      } catch (error) {
        console.log(" error:", error.msg);
        this.loading = false;
      }
    },
    async confirmUnlockNovel() {
      this.loading = true;
      try {
        const res = await this.$axios.$post("/api/payment/confirm_unlock_novel", {
          site_id: process.env.SITE_ID,
          novel_id: this.currentChapterDetail.novel_info.id
        });
        console.log(" response:", res);
        if (res.unlock_status === "create_success" || res.unlock_status === "already_pending") {
          window.location.href = res.order_info.url;
        } else {
          // unlock_success
          this.$emit("reload");
          this.loading = false;
        }
      } catch (error) {
        console.log(" error:", error.msg);
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.read-container {
  width: 100%;
  max-width: 900px;
  margin: 100px auto 32px;
  padding: 0 30px 40px;
  background: #fffefc;
  box-shadow: 0 0 11px 0 rgba($color6, 0.06);
  border-radius: 2px;
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
  margin-top: -60px;
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
  p {
    font-size: 16px;
    line-height: 26px;
  }
}
.content-text {
  ::v-deep .br {
    height: 16px;
  }
  // 正文第一个广告位
  ::v-deep .content-ad-1 {
    margin-bottom: 16px;
    font-family: "se";
  }
  ::v-deep .content-ad-follow {
    height: 120px;
    margin-bottom: 16px;
    font-family: "se";
  }
}

.ad-1 {
  height: 120px;
  margin-top: 16px;
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
    min-height: 100vh;
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
    p {
      font-size: var(--read-font-size);
      line-height: var(--read-font-space);
    }
  }
  .content-text {
    ::v-deep .br {
      height: calc(var(--read-font-size) * var(--read-font-space) * 0.5);
    }
    ::v-deep .content-ad-1 {
      width: 100vw;
      margin-left: vw(-46);
      margin-bottom: calc(var(--read-font-size) * var(--read-font-space) * 0.5);
    }
    ::v-deep .content-ad-follow {
      display: block;
      width: 100vw;
      margin-left: vw(-46);
      margin-bottom: calc(var(--read-font-size) * var(--read-font-space) * 0.5);
    }
  }

  .ad-1 {
    width: 100vw;
    height: 120px;
    margin-left: vw(-46);
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
  .pagination-box {
    margin-top: vw(32);
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
