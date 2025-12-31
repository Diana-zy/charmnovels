<!-- eslint-disable vue/no-v-html -->
<template>
  <section>
    <section v-if="currentChapterDetail" class="read-container">
      <custom-back-header
        v-if="isMobile"
        isPageContent
        :position="'relative'"
        :title="currentChapterDetail.novel_info.name"
        needBackModel
        :url="`/novel/${currentChapterDetail.novel_info.id}/`"
      />
      <!-- 第一章节才展示 top-info-->
      <div v-if="currentChapterDetail.chapter_num === 1 && !isMobile" class="top-info">
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
      <article
        class="read-content"
        :class="{ 'lock-content': isLock }"
        ref="parentContentRef"
        @click="handleShowMenuSetting"
      >
        <h3
          >Chapter {{ currentChapterDetail.chapter_num }}
          <!--        {{ currentChapterDetail.chapter_name }}-->
        </h3>
        <p ref="contentTextRef" class="content-text" v-html="chapterContent"></p>
        <div class="lock-content-bottom pc-hidden-block" v-show="isLock"></div>
      </article>

      <!--    章节底部按钮-->
      <div :class="{ 'btn-box-show': showBtnBox || isLock }" class="btn-box pc-hidden-flex">
        <div class="chapter-list btn" @click="handleShowChapterPopup">
          <span class="icon-menu"></span>
          List
        </div>
        <div
          :to="preChapterPath"
          :class="['btn-change', 'btn-pre', { 'btn-disable': preChapterItem === null }]"
          @click="(event) => handleClickPageChapter(event, preChapterItem, preChapterPath)"
        >
          <div class="previous btn"> Previous</div>
        </div>
        <div
          :to="nextChapterPath"
          :class="['btn-change', 'btn-next', { 'btn-disable': nextChapterItem === null }]"
          @click="
            (event) => handleClickPageChapter(event, nextChapterItem, nextChapterPath, 'next')
          "
        >
          <div class="next btn"> Next</div>
        </div>
      </div>

      <!--    付费章节底部模块-->
      <section class="lock-bottom-operation" v-if="isLock">
        <div class="lock-operation-title">— Locked Chapter —</div>
        <div class="lock-user-info">
          <div>Price: {{ currentChapterDetail.coin_price }} coins </div>
          <div>Words of this chapter: {{ currentChapterDetail.word_count }}</div>
          <div>Balance: {{ userInfo?.coin }} coins</div>
        </div>
        <!--        <google-ad-preload class="ad-1" ad-slot="7793230426" />-->
        <!--      <div class="download-app"> Download App to read this chapter for FREE </div>-->
        <div class="lock-btn-box">
<!--          <div-->
<!--            class="watch-ad-unlock"-->
<!--            @click="handleViewAdUnlock()"-->
<!--            :class="{ 'disable-btn': !userInfo?.user_free_count }"-->
<!--          >-->
<!--            <div> Watch Ad To Unlock This Chapter</div>-->
<!--            <div> Watched Today({{ 5 - userInfo?.user_free_count }}/5)</div>-->
<!--          </div>-->
          <div class="purchase-stripe" @click="handlePurchaseStripe">
            Unlock This Chapter With {{ this.currentChapterDetail.coin }} Coins
          </div>
          <div class="auto-btn" @click="handleClickAutoUnLock">
            <span class="check-box">
              <span v-show="autoUnLock" class="check-box-inner"></span>
            </span>
            <span class="check-box-title">Auto Unlock Next Chapter</span>
          </div>
        </div>
      </section>

      <section v-if="!isMobile" class="bottom-operation">
        <!-- 支付模块 -->
        <!--      <div-->
        <!--        v-if="currentChapterDetail.purchase_status !== 2"-->
        <!--        class="pay-box"-->
        <!--        @click="createPaymentOrder(currentChapterDetail.purchase_status)"-->
        <!--      >-->
        <!--        <div class="row-status">-->
        <!--          <i class="icon-lock"></i>-->
        <!--          <span>Unlock</span>-->
        <!--        </div>-->
        <!--        <div class="row-info">-->
        <!--          <span v-if="currentChapterDetail.purchase_status !== 1"-->
        <!--            >${{ currentChapterDetail.novel_info.price }}</span-->
        <!--          >-->
        <!--          <span>{{-->
        <!--            currentChapterDetail.purchase_status === 1-->
        <!--              ? "Continue payment"-->
        <!--              : "Enjoy reading this novel"-->
        <!--          }}</span>-->
        <!--        </div>-->
        <!--      </div>-->
        <!--      <div-->
        <!--        v-if="currentChapterDetail.purchase_status === 1 && currentChapterDetail.chapter_num > 8"-->
        <!--        class="status-paid"-->
        <!--        @click="getOrderUnlockStatus"-->
        <!--      >-->
        <!--        Paid(Not unlocked)</div-->
        <!--      >-->
        <!-- 分页模块 -->
        <div class="pagination-box">
          <custom-link
            :to="preChapterPath"
            :class="['btn-change', 'btn-pre', { 'btn-disable': preChapterItem === null }]"
            @click.native="(event) => handleClickPageChapter(event, preChapterItem)"
          >
            <i class="icon-prev"></i>
            <span>Previous Chapter</span>
          </custom-link>
          <custom-link
            :to="nextChapterPath"
            :class="['btn-change', 'btn-next', { 'btn-disable': nextChapterItem === null }]"
            @click.native="(event) => handleClickPageChapter(event, nextChapterItem)"
          >
            <span>Next Chapter</span>
            <i class="icon-next"></i>
          </custom-link>
        </div>
      </section>
      <!-- 相关章节模块 -->
      <!--    <section v-if="relatedChapterList !== 0" class="module-related-chapters">-->
      <!--      <common-title-label title="Related Chapters" />-->
      <!--      <div class="module-related-chapters-content">-->
      <!--        <item-module-related-chapter-->
      <!--          v-for="(item, i) in relatedChapterList"-->
      <!--          :key="i"-->
      <!--          :item="item"-->
      <!--          :to="-->
      <!--            item.isUnlocked && currentChapterDetail.purchase_status !== 2-->
      <!--              ? `/read/?ch=${item.id}`-->
      <!--              : ''-->
      <!--          "-->
      <!--          @handle-click-chapter="$emit('change-chapter', item)"-->
      <!--        />-->
      <!--      </div>-->
      <!--    </section>-->
    </section>
    <common-loading-max v-if="loading" />
    <!--    付费弹出层-->
    <dialog-top-up-popup
      ref="topUpPopupRef"
      :visible.sync="showTopUpPopup"
      @handlePayByStripe="handlePayByStripe"
      @handleWinBack="handleWinBack"
    ></dialog-top-up-popup>

    <!--    挽回弹窗-->
    <dialog-win-back-box
      ref="winBackBoxRef"
      :userInfo="userInfo"
      @handlePayByStripe="handlePayByStripe"
      @handleViewAdUnlock="handleViewAdUnlock"
    ></dialog-win-back-box>

    <!--    挽回弹窗-->
    <dialog-incentive-ad-use-up-tip
      ref="incentiveAdUseUpTipRef"
      @handleClickUnlockNow="handleClickUnlockNow"
    ></dialog-incentive-ad-use-up-tip>
  </section>
</template>

<script>
import Vue from "vue";
import Storage from "@/utils/storage";
import googleAdPreload from "@/components/GoogleAdPreload";
import googleAdSmall from "@/components/GoogleAdSmall";
import { getUserInfo, unlockNovelChapter, paymentSKU } from "~/api/api";
import { simulateClickToPath } from "~/utils/utils";

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
      loading: false,
      isMobile: false,
      firstTagCount: 30, // 首次广告展示的字数位置
      followingTagCount: 1200, // 后续广告展示的字数间隔
      currentTagIndex: 0, // 当前广告展示的字数位置
      observer: null,
      showBtnBox: false,
      offsetTop: null,
      autoUnLock: true,
      showTopUpPopup: false,
      // isLock: true,
      userInfo: null
    };
  },
  async created() {
    await this.updateUserCoins();
  },
  computed: {
    chapterContent() {
      let content = this.currentChapterDetail?.content.replace(/\n\n/g, "\n");
      content = content?.replace(/\n/g, "<p class='br'></p>");
      return content;
    },
    preChapterPath() {
      return this.preChapterItem === null ? "#" : `/read/?ch=${this.preChapterItem.id}`;
    },
    nextChapterPath() {
      return this.nextChapterItem === null ? "#" : `/read/?ch=${this.nextChapterItem.id}`;
    },
    isLock: {
      get() {
        return this.currentChapterDetail?.locked_chapter && !this.currentChapterDetail?.is_unlock;
      }
    }
  },
  watch: {
    currentChapterDetail: {
      handler(val) {
        if (val) {
          if (!val?.locked_chapter) {
            window.handleFreeNovelPush(val.chapter_num);
          }
          if (!this.isLock && !window.Novel_Chapter_Read) {
            window.Novel_Chapter_Read = true;
            window.dataLayer.push({
              event: "Novel_Chapter_Read",
              novel_chapter_read: `novel_${this.currentChapterDetail.novel_info.id}_chap_${this.currentChapterDetail.chapter_num}`
            });
          }
        }
      },
      immediate: true,
      deep: true
    },
    chapterContent(newContent) {
      if (newContent && !this.isLock) {
        this.$nextTick(() => {
          const cut30pTags = this.getContentPTagesToLength(30);
          if (cut30pTags) {
            this.insertContentAd(cut30pTags, "content-ad-1", "page", "7045171250", true, 1);
          }

          // 免费章节或解锁章节，插入中间段落广告
          // if (
          //   this.currentChapterDetail.purchase_status === 2 ||
          //   this.currentChapterDetail.chapter_num <= 8
          // ) {
          this.createCountPTagsAd();
          // }
          this.updateDomStatus();
          if (this.currentChapterDetail?.locked_chapter === 0) {
            window.handleObserveInsert(this.currentChapterDetail.chapter_num);
          }
        });
      }
    },
    isLock: {
      handler(val) {
        if (val && !window.Novel_Lock_Chap_Page) {
          window.Novel_Lock_Chap_Page = true;
          window.dataLayer.push({
            event: "Novel_Lock_Chap_Page",
            lock_chap_page: "lock_chap_show "
          });
        }
      },
      immediate: true
    }
  },
  updated() {
    if (!this.isLock) {
      this.updateDomStatus();
      if (this.currentChapterDetail?.locked_chapter === 0) {
        window.handleObserveInsert(this.currentChapterDetail.chapter_num);
      }
    }
  },
  mounted() {
    this.isMobile = window.innerWidth <= 750;
    this.initStorageReadSetting();
    this.autoUnLock = Storage.getItem("autoUnLock") !== "no";
    const root = document.documentElement;
    root.style.setProperty("--read-font-size", Storage.getCookie("novel_cssReadFontSize") + "px");
    root.style.setProperty("--read-font-space", Storage.getCookie("novel_cssReadFontSpace"));
    root.style.setProperty("--read-bg-color", Storage.getCookie("novel_cssReadBackgroundColor"));
    // root.style.setProperty("--read-bg-color-num", Storage.getCookie("novel_cssReadBackgroundColorNum"));
    root.style.setProperty("--read-text-color", Storage.getCookie("novel_cssReadTextColor"));
    root.style.setProperty(
      "--linear-gradient",
      `linear-gradient(
        180deg,
        rgba(${Storage.getCookie("novel_cssReadBackgroundColorNum")}, 0.5),
        rgba(${Storage.getCookie("novel_cssReadBackgroundColorNum")}, 1)
      )`
    );
  },
  methods: {
    handleSaveSecondAd(e) {
      if (
        e[0].isIntersecting &&
        this.currentChapterDetail.chapter_num === 1 &&
        !window.first_chap_action_button
      ) {
        window.first_chap_action_button = true;
        window.dataLayer.push({
          event: "Novel_Free_Chap_Page",
          free_chap_show: "first_chap_action_button "
        });
      }
      this.offsetTop = e[0].target.offsetTop - e[0].target.clientHeight;
      if (this.offsetTop) {
        this.showBtnBox = e[0].isIntersecting || window.scrollY >= this.offsetTop;
      } else {
        this.showBtnBox = e[0].isIntersecting;
      }
    },
    handleShowChapterPopup() {
      this.$emit("handleShowChapterPopup");
    },
    handleClickAutoUnLock() {
      this.autoUnLock = !this.autoUnLock;
    },
    //付费
    async handlePurchaseStripe() {
      this.loading = true;
      //点击金币解锁
      window.dataLayer.push({
        event: "Novel_Lock_Chap_Page",
        lock_chap_page: "lock_chap_button_coins_click"
      });
      //调一遍用户信息接口更新一下钱 再判断
      await this.updateUserCoins();
      if (this.userInfo.coin >= this.currentChapterDetail.coin_price) {
        //如果钱够直接扣费
        unlockNovelChapter({
          novel_id: this.currentChapterDetail.novel_info.id,
          chapter_id: this.currentChapterDetail.chapter_id,
          unlock_type: 2
        }).then((res) => {
          this.loading = false;
          if (res.success) {
            // console.log(res);
            if (res.data.status === 1) {
              window.dataLayer.push({
                event:'Click_Unlock_With_Coins'
              })
              window.trackEventToPixel("Click_Unlock_With_Coins");
              window.trackEventToPixel("Unlock_Succeed");
              window.trackEventToPixel("Unlock_With_Coins");
              window.dataLayer.push({
                event: "Unlock_Succeed"
              });
              window.dataLayer.push({
                event: "Unlock_With_Coins"
              });
              if (this.autoUnLock) {
                Storage.setItem("autoUnLock", "yes");
              } else {
                Storage.setItem("autoUnLock", "no");
              }
            }
            this.$emit("reload");
          }
        });
      } else {
        //钱不够，进入充值
        // this.loading = true;
        window.dataLayer.push({
          event: "Novel_Lock_Chap_Page",
          lock_chap_page: "lock_chap_purchase_dialog_show"
        });
        window.dataLayer.push({
          event:'Click_Unlock_With_Coins'
        })
        window.trackEventToPixel("Click_Unlock_With_Coins");
        // if (this.autoUnLock) {
        //   Storage.setItem("autoUnLock", "yes");
        // } else {
        //   Storage.setItem("autoUnLock", "no");
        // }
        this.$refs.topUpPopupRef.handleOpen(() => {
          this.loading = false;
        });
      }
    },
    handlePayByStripe(val) {
      this.createPaymentOrder(this.currentChapterDetail.purchase_status, val);
    },
    handleViewAdUnlock(callback) {
      if (this.userInfo?.user_free_count) {
        // 判断当前章节是否连续请求激励失败累计3次
        const chapterId = this.$route.query.ch;
        let chapterErrorIncentiveAd = getCookie("chapterErrorIncentiveAd");
        if (chapterErrorIncentiveAd) {
          chapterErrorIncentiveAd = JSON.parse(chapterErrorIncentiveAd);
          if (chapterErrorIncentiveAd[chapterId] && chapterErrorIncentiveAd[chapterId] >= 3) {
            this.$globalMethod.showNotification({
              message: "Network error, retry later.",
              type: "warning"
            });
            return;
          }
        }

        if (!callback) {
          window.dataLayer.push({
            event: "Novel_Lock_Chap_Page",
            lock_chap_page: "lock_chap_button_watch_ad_click"
          });
        }
        // 挽回弹窗
        else {
          window.dataLayer.push({
            event: "Novel_Purchase_Dialog",
            purchase_dialog: "second_page_button_watch_ad_click"
          });
        }

        this.loading = true;
        this.$emit("change-chapter", this.currentChapterDetail, callback);
      } else {
        if (callback instanceof Function) {
          callback();
        }
        this.$refs.incentiveAdUseUpTipRef.visible = true;
      }
    },
    handleClickUnlockNow() {
      this.handlePurchaseStripe();
    },
    handleWinBack(val) {
      this.loading = true;
      this.$refs.winBackBoxRef?.handleOpen(val, () => {
        this.loading = false;
      });
    },
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
      Storage.getCookie("novel_cssReadBackgroundColorNum") ||
        Storage.setCookie("novel_cssReadBackgroundColorNum", `255,252,247`);
    },
    handleCloseLoading() {
      this.loading = false;
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
    insertContentAd(markEl, className, adType = "page", adSlot, isPreload = false, isSecond) {
      const componentInstance = new (Vue.extend(isPreload ? googleAdPreload : googleAdSmall))({
        propsData: {
          adSlot,
          adType
        }
      });
      componentInstance.$mount();
      componentInstance.$el?.classList.add(className);
      if (isSecond === true) {
        componentInstance.$el?.classList.add("content-ad-2");
      } else if (!isSecond) {
        componentInstance.$el?.classList.add("content-ad-3");
      }
      markEl.insertAdjacentElement("afterend", componentInstance.$el);
    },

    createCountPTagsAd() {
      this.currentTagIndex++;
      const cutTextCountPTags = this.getContentPTagesToLength(
        this.currentTagIndex * this.followingTagCount + this.firstTagCount
      );
      // console.log(cutTextCountPTags, "cutTextCountPTags");

      // 可填充且广告数量不超过9
      if (cutTextCountPTags && this.currentTagIndex <= 2) {
        const adSlotArr = [
          "7313227898", // page-1
          "4933744044" // page-2
          // "8770052860" // page-3
        ];
        // const adTypeArr = ["page"];
        const adType = "page"; // ["page","inline","info"]
        this.insertContentAd(
          cutTextCountPTags,
          `content-ad-${adType}`,
          adType,
          adSlotArr[this.currentTagIndex - 1],
          false,
          this.currentTagIndex === 1
        );
        this.createCountPTagsAd();
      }
    },

    handleClickPageChapter(event, item, path, type) {
      if (type === "next" && this.currentChapterDetail?.locked_chapter === 0) {
        if (this.currentChapterDetail.chapter_num === 1) {
          window.dataLayer.push({
            event: "Novel_Free_Chap_Click",
            free_chap_click: "first_chap_button_next_click"
          });
          const hi_source = getValueByURLOrCookie("hi_source");
          const {
            hi_source_clid,
          } = getSourceClid(hi_source);
          if(!window.getCookie("First_Chapter_Click_Next_Button"+this.currentChapterDetail.chapter_id+hi_source_clid)){
            window.trackEventToPixel("First_Chapter_Click_Next_Button");
            window.dataLayer.push({
              event: "First_Chapter_Click_Next_Button",
            });
            window.setCookie("First_Chapter_Click_Next_Button"+this.currentChapterDetail.chapter_id+hi_source_clid,'yes')
          }
        } else {
          window.dataLayer.push({
            event: "Novel_Free_Chap_Click",
            free_chap_click: "other_chap_button_next_click"
          });
        }
      }
      if (item !== null && this.isLock) {
        window.dataLayer.push({
          event: "Novel_Lock_Chap_Page",
          lock_chap_page: "lock_chap_button_prev_next_click"
        });
      }
      if (item !== null && path) {
        if (Storage.getItem("autoUnLock") === "yes" && item?.locked_chapter && !item?.is_unlock) {
          unlockNovelChapter({
            novel_id: item.novel_id,
            chapter_id: item.id,
            unlock_type: 2
          }).then(async (res) => {
            if (res.success && res.data.status === 1) {
              window.trackEventToPixel("Unlock_Succeed");
              window.trackEventToPixel("Unlock_With_Coins");
              window.dataLayer.push({
                event: "Unlock_With_Coins"
              });
              await window.dataLayer.push({
                event: "Unlock_Succeed"
              });
            }
            setTimeout(() => {
              simulateClickToPath(path);
            });
          });
        } else {
          simulateClickToPath(path);
        }
      }
      // if (item === null || !item.isUnlocked) {
      //   // event.preventDefault();
      //   // 有章节且需要解锁
      //   // if (item !== null && !item.isUnlocked) {
      //   //   this.$emit("change-chapter", item);
      //   // }
      // }
    },

    // 创建or支付订单
    createPaymentOrder(purchaseStatus, skuId) {
      // if (!Storage.getCookie("novel_token")) {
      //   this.$globalMethod.showDialog("Your account is not logged in, please log in.");
      //   return;
      // }

      if (purchaseStatus === 0) {
        this.unlockNovel(skuId);
        // 创建新订单
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
    async unlockNovel(skuId) {
      this.loading = true;
      // 调用接口解锁小说
      try {
        // const res = await this.$axios.$post("/api/payment/unlock_novel", {
        //   site_id: process.env.SITE_ID,
        //   novel_id: this.currentChapterDetail.novel_info.id,
        //   redirect_url: `${window.location.href}&nov=${this.currentChapterDetail.novel_info.id}`
        // });
        const data = {
          sku_id: skuId,
          novel_id: this.currentChapterDetail.novel_info.id,
          chapter_id: this.currentChapterDetail.chapter_id,
          redirect_url: `${window.location.href}&nov=${this.currentChapterDetail.novel_info.id}`
        };
        await paymentSKU(data).then((res) => {
          if (res.success) {
            console.log(" response:", res);
            const { url } = res.data.order_info;
            if (res.success) {
              window.dataLayer.push({
                event: "Purchase_action",
                purchase_action: "start_purchase_with_stripe"
              });
              window.dataLayer.push({
                event: "Start_Purchase_Novel",
                purchase_novel: `id_${this.currentChapterDetail.novel_info.id}`
              });
            }
            if (this.autoUnLock) {
              Storage.setItem("autoUnLock", "yes");
            } else {
              Storage.setItem("autoUnLock", "no");
            }
            window.location.href = url;
          }
        });
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
    },
    async updateUserCoins() {
      await getUserInfo().then((res) => {
        // console.log(res, "res");
        if (res.success) {
          this.userInfo = res.data;
        }
      });
    },
    updateDomStatus() {
      const dom = document.getElementsByClassName("content-ad-2");
      if (dom) {
        if (this.observer && dom[0]) {
          this.observer.unobserve(dom[0]);
        }
        this.observer = new IntersectionObserver(this.handleSaveSecondAd, {
          threshold: 1
        });
        setTimeout(() => {
          if (dom[0]) {
            this.observer.observe(dom[0]);
          }
        }, 0);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.read-container {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
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
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
  h3 {
    font-size: 20px;
    line-height: 26px;
    padding: 24px 0 16px;
    font-weight: bold;
  }
  p {
    font-size: 16px;
    line-height: 26px;
  }
}
.lock-content {
  height: 300px;
  overflow: hidden;
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
  ::v-deep .content-ad-page {
    margin: 0 auto 16px;
    font-family: "se";
  }
  ::v-deep .content-ad-inline {
    height: 50px;
    margin: 0 auto 16px;
  }
  ::v-deep .content-ad-info {
    margin: 0 auto 16px;
    font-family: "se";
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
.disable-btn {
  cursor: not-allowed;
  background: rgba($color2, 0.6) !important;
  div:first-child {
    color: $color1 !important;
  }
}
.lock-bottom-operation {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
  margin-top: 32px;
  .lock-operation-title {
    margin-bottom: 24px;
    font-weight: bold;
    font-size: 22px;
    //color: $color2;
    line-height: 30px;
    text-align: center;
    width: 100%;
  }
  .lock-user-info {
    width: 100%;
    height: 128px;
    line-height: 42px;
    /*font-weight: 600;*/
    font-size: 24px;
    //color: $color2;
  }
  .download-app {
    cursor: pointer;
    font-weight: 600;
    font-size: 24px;
    color: $color3;
    text-decoration: underline;
    text-align: center;
    margin-top: 20px;
  }
  .lock-btn-box {
    cursor: pointer;
    background: var(--read-bg-color);
    .watch-ad-unlock {
      height: 88px;
      width: 360px;
      background: rgba(#ff9345, 0.3);
      border-radius: 44px;
      margin: 20px auto 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      div:first-child {
        font-weight: bold;
        font-size: 20px;
        color: $color3;
        line-height: 32px;
        text-align: center;
      }
      div:last-child {
        font-size: 16px;
        font-weight: 400;
        //color: $color2;
        line-height: 22px;
        text-align: center;
      }
    }
    .purchase-stripe {
      height: 88px;
      width: 360px;
      background: #ff9345;
      border-radius: 44px;
      margin: 20px auto 0;
      color: $color1;
      line-height: 88px;
      text-align: center;
      font-weight: bold;
      font-size: 22px;
    }
    .auto-btn {
      width: 348px;
      height: 32px;
      margin: 20px auto 0;
      font-weight: 400;
      font-size: 22px;
      // color: $color2;
      display: flex;
      align-items: center;
      .check-box {
        margin-right: 10px;
        width: 28px;
        height: 28px;
        border: 1px solid $color3;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        .check-box-inner {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: $color3;
        }
      }
    }
  }
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
    /*margin-top: vw(48);*/
    padding-bottom: vw(80);
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
  .lock-content {
    height: calc(var(--read-font-size) * var(--read-font-space) * 8 + vw(102));
    overflow: hidden;
    padding-bottom: 0;
    position: relative;
    .lock-content-bottom {
      position: absolute;
      background: var(--linear-gradient);
      left: 0;
      bottom: 0;
      width: 100%;
      height: calc(var(--read-font-size) * var(--read-font-space) * 3);
    }
  }

  .lock-bottom-operation {
    margin-top: vw(48);
    /*margin-bottom: vw(40);*/
    /*padding-bottom: vw(80);*/
    .lock-operation-title {
      margin-bottom: vw(24);
      font-weight: bold;
      font-size: vw(34);
      //color: $color2;
      line-height: var(--read-font-space);
      text-align: center;
      width: 100%;
    }
    .lock-user-info {
      width: 100%;
      height: vw(128);
      line-height: var(--read-font-space);
      /*font-weight: 600;*/
      font-weight: 300;
      font-size: vw(24);
      text-align: center;
      //color: $color2;
    }
    .download-app {
      font-weight: 600;
      font-size: vw(28);
      color: $color3;
      text-decoration: underline;
      text-align: center;
      margin-top: vw(20);
    }
    .ad-1 {
      margin-bottom: vw(30);
    }
    .lock-btn-box {
      width: 100vw;
      position: fixed;
      bottom: vw(80);
      padding-bottom: vw(40);
      padding-top: vw(32);
      transform: translateX(vw(-46));
      .watch-ad-unlock {
        height: vw(88);
        width: vw(658);
        background: rgba(#ff9345, 0.3);
        border-radius: vw(100);
        margin-top: vw(24);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        div:first-child {
          font-weight: bold;
          font-size: vw(28);
          color: $color3;
          line-height: vw(38);
          text-align: center;
        }
        div:last-child {
          font-size: vw(20);
          font-weight: 400;
          //color: $color2;
          line-height: vw(26);
          text-align: center;
        }
      }
      .purchase-stripe {
        height: vw(88);
        width: vw(658);
        background: #ff9345;
        border-radius: vw(100);
        margin-top: vw(24);
        color: $color1;
        line-height: vw(88);
        text-align: center;
        font-weight: bold;
        font-size: vw(28);
      }
      .auto-btn {
        width: auto;
        height: vw(48);
        margin: vw(24) auto 0;
        font-weight: 300;
        font-size: vw(24);
        // color: $color2;
        display: flex;
        align-items: center;
        justify-content: center;
        .check-box {
          margin-right: vw(10);
          width: vw(28);
          height: vw(28);
          border: vw(2) solid $color3;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          .check-box-inner {
            width: vw(15);
            height: vw(15);
            border-radius: 50%;
            background: $color3;
          }
        }
      }
    }
  }

  .content-text {
    ::v-deep .br {
      height: calc(var(--read-font-size) * var(--read-font-space));
    }
    ::v-deep .content-ad-1 {
      margin-bottom: calc(var(--read-font-size) * var(--read-font-space) * 0.5);
    }
    ::v-deep .content-ad-page {
      margin-bottom: calc(var(--read-font-size) * var(--read-font-space) * 0.5);
    }
    ::v-deep .content-ad-inline {
      height: 50px;
      margin-bottom: calc(var(--read-font-size) * var(--read-font-space) * 0.5);
    }
    ::v-deep .content-ad-info {
      margin-bottom: calc(var(--read-font-size) * var(--read-font-space) * 0.5);
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

  .btn-box {
    width: 100%;
    background: $color1;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: nowrap;
    height: vw(80);
    transform: translateY(vw(80));
    transition: all 0.3s;
    z-index: 100;
    .btn {
      width: vw(248);
      height: vw(80);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(#d9d9d9, 0.3);
      color: $color2;
      font-weight: 600;
      font-size: vw(28);
    }
    .icon-menu {
      margin-right: vw(12);
      @include icon(vw(48), vw(48), "icon-menu.png");
    }
    .next {
      background: rgba(#f59a23, 0.3);
      color: $color3;
    }
  }
  .btn-box-show {
    transform: translateY(vw(0));
    transition: all 0.6s;
  }
}
</style>
