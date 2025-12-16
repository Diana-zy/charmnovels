<template>
  <main>
    <custom-header v-if="!isMobile" />
    <custom-back-header v-else needBackModel @handleOpenRecommendBox="handleOpenRecommendBox" />
    <section v-if="novelDetailInfo" class="module-introduce">
      <div class="introduce-content">
        <div class="cover-container">
          <nuxt-img
            class="cover"
            width="200"
            height="300"
            fit="cover"
            format="auto"
            :src="novelDetailInfo.cover"
            alt="cover"
          />
          <i class="bg-book-edge"></i>
        </div>
        <div class="introduce-info">
          <h3 class="name">{{ novelDetailInfo.name }}</h3>
          <div class="author-row">
            <!--            <span>{{ novelDetailInfo.category }}</span>-->
            <!--            <span class="line"></span>-->
            <span>By:{{ novelDetailInfo.author }}</span>
          </div>
          <div class="author-row updated-time-row">
            <span>Latest Updated: {{ novelUpdatedDate }}</span>
          </div>

          <!--          最新章节 -->
          <div class="latest-chapter pc-hidden-flex" @click="handleShowChapterPopup">
            <div>Latest Chapter Chapter {{ novelChapterList.length }}</div>
            <div class="icon-arrow-right"> </div>
          </div>

          <!--          是否连载-->
          <div class="novel-status pc-hidden-block">
            <span>{{ novelDetailInfo.is_complete ? "Completed!" : "Update Just Now!" }}</span>
            <!--            <span>/</span>-->
            <!--            <span>Update Just Now!</span>-->
          </div>
          <!--          <div class="rating rating-mobile pc-hidden-flex">-->
          <!--            <i-->
          <!--              v-for="(item, i) in getStarListStyle(novelDetailInfo.score)"-->
          <!--              :key="i"-->
          <!--              :class="item"-->
          <!--              class="rating-item"-->
          <!--            ></i>-->
          <!--            <span class="score">{{ getStarScore(novelDetailInfo.score) }}</span>-->
          <!--          </div>-->

          <div class="info-row m-hidden-flex">
            <div class="m-hidden-block">
              <div class="rating">
                <i
                  v-for="(item, i) in getStarListStyle(novelDetailInfo.score)"
                  :key="i"
                  :class="item"
                  class="rating-item"
                ></i>
                <span class="score">{{ getStarScore(novelDetailInfo.score) }}</span>
              </div>
              <span>Score</span>
            </div>
            <div>
              <p>{{ novelDetailInfo.chapter }}</p>
              <span>Chapters</span>
            </div>
            <div>
              <p>{{ novelDetailInfo.view }}</p>
              <span>Views</span>
            </div>
          </div>

          <custom-link :to="startReadPath" class="btn-read">
            <i class="icon-read-book"></i>
            <span>{{
              novelDetail.user_last_read_chapter_num === 0 ? "Start Reading" : "Continue Reading"
            }}</span>
          </custom-link>
        </div>
      </div>

      <!--      <google-ad-preload class="google-ad" ad-slot="2858514230" />-->

      <p class="desc m-hidden-block">{{ novelDetailInfo.intro }}</p>
      <module-expandable-text
        :text="novelDetailInfo.intro"
        :novelDetailInfo="novelDetailInfo"
        class="pc-hidden-block"
      >
        <div class="novel-info-rating">
          <div class="novel-info-user">
            <div>{{ novelDetailInfo.view }}</div>
            <div>Users Viewed</div>
          </div>
          <div class="line"></div>
          <div class="novel-info-rating-box">
            <div class="score">{{ getStarScore(novelDetailInfo.score) }} Points</div>
            <div class="rating rating-mobile">
              <i
                v-for="(item, i) in getStarListStyle(novelDetailInfo.score)"
                :key="i"
                :class="item"
                class="rating-item"
              ></i>
              <span v-show="!novelDetail.real_score" class="rating-book" @click="handleRatingBook">
                Rating this book</span
              >
            </div>
          </div>
        </div>
      </module-expandable-text>
    </section>

    <section class="novel-info pc-hidden-block">
      <div class="novel-info-top">
        <div class="left-title">Chapter 1</div>
        <div class="right-btn" @click="handleShowChapterPopup"
          >Chapter List <span class="icon-arrow-right"></span
        ></div>
      </div>
      <div class="novel-content-top novel-content"> {{ firstP }} </div>
      <google-ad-preload class="google-ad" ad-slot="2858514230" />
      <div class="novel-content-bottom novel-content" v-html="otherP"> </div>
    </section>

    <section class="module-all">
      <common-title-label v-if="!isMobile" title="Rec Books" />
      <!-- PC端rec模块 -->
      <common-infinite-scroll-list
        v-if="!isMobile"
        api-endpoint="/api/novel/novel_module"
        :initial-page="2"
        :page-size="4"
        :initial-items="allBooks"
        :params="{ module_id: 'all' }"
        class="module-all-content m-hidden-grid"
      >
        <template #default="{ items }">
          <item-module-all
            v-for="(item, i) in items"
            :key="i"
            :item="item"
            :index="i"
            :to="`/novel/${item.id}/`"
          />
        </template>
      </common-infinite-scroll-list>
      <!-- 移动端rec模块 -->
      <!--      <div v-if="isMobile" class="module-rec-mobile">-->
      <!--        <div class="module-rec-list">-->
      <!--          <div-->
      <!--            v-for="(item, i) in recBooks.slice(0, 5)"-->
      <!--            :key="i"-->
      <!--            class="item"-->
      <!--            @click="handleRecItemClick(i)"-->
      <!--          >-->
      <!--            <div :class="['cover', { active: i === currentRecIndex }]">-->
      <!--              <nuxt-img-->
      <!--                width="112"-->
      <!--                height="168"-->
      <!--                fit="cover"-->
      <!--                format="auto"-->
      <!--                :src="item.cover"-->
      <!--                :alt="item.name"-->
      <!--              />-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <item-module-all-->
      <!--          :item="recBooks[currentRecIndex]"-->
      <!--          :index="0"-->
      <!--          :to="`/novel/${recBooks[currentRecIndex].id}/`"-->
      <!--        />-->
      <!--      </div>-->
    </section>

    <!--    小说评分-->
    <dialog-rating-box
      :visible.sync="ratingBook"
      @handleCloseRatingBook="handleCloseRatingBook"
    ></dialog-rating-box>

    <dialog-recommend-box
      :recBooks="trending.filter((item) => item.id !== novelDetailInfo?.id).slice(0, 5)"
      :visible.sync="showRecommendBox"
    ></dialog-recommend-box>
    <!-- 移动端章节弹窗 -->
    <transition name="fade">
      <div v-show="isShowChapterPopup" class="chapter-list-popup">
        <div class="mask" @click="handleHideChapterPopup"></div>
        <transition name="slide">
          <module-read-chapter
            v-show="isShowChapterPopup"
            ref="mobileChapterPopup"
            :chapters="novelChapterList"
            :purchase-status="novelDetail?.purchase_status"
            :current-chapter-id="novelDetail?.user_last_read_chapter_id"
            @close-chapter-popup="handleHideChapterPopup"
            @change-chapter="handleOpenIncentiveAd"
          />
        </transition>
      </div>
    </transition>
    <!-- 底部菜单 -->
    <section class="bottom-menu pc-hidden-flex">
      <!--      <div class="menu-item menu-chapters" @click="handleShowChapterPopup">-->
      <!--        <i class="icon-chapters"></i>-->
      <!--        <span>Chapters</span>-->
      <!--      </div>-->
      <custom-link :to="startReadPath" class="menu-item menu-read">
        <i class="icon-reading"></i>
        <span>{{
          novelDetail?.user_last_read_chapter_num === 0 ? "Start Reading" : "Continue Reading"
        }}</span>
      </custom-link>
    </section>
    <!-- 激励视频广告 -->
    <incentive-ad ref="refIncentiveAd" @close-incentive-ad="closeIncentiveAd" />
    <common-notification />
    <ad-loading />
    <common-back-top />
  </main>
</template>

<script>
import Storage from "~/utils/storage";
import {
  getStarListStyle,
  getStarScore,
  shuffleArray,
  simulateClick,
  getIsWatchedIncentiveVideo,
  setWatchedIncentiveVideo
} from "~/utils/utils";
import { saveNovelScore } from "~/api/api";
export default {
  async asyncData({ $axios, params, env }) {
    try {
      const [allBooksResponse, recBooksResponse, trendingResponse] = await Promise.all([
        $axios.$post("/api/novel/novel_module", {
          site_id: env.SITE_ID,
          module_id: "all",
          page_size: 4,
          page: 1
        }),
        $axios.$post("/api/novel/novel_module", {
          site_id: env.SITE_ID,
          module_id: "all",
          page_size: 20,
          page: 1
        }),
        $axios.$post("/api/novel/novel_module", {
          site_id: env.SITE_ID,
          module_id: "trending",
          page_size: 6,
          page: 1
        })
      ]);
      const recBooks = shuffleArray(recBooksResponse.novel_list).slice(0, 5);
      return {
        allBooks: allBooksResponse.novel_list,
        recBooks,
        trending: trendingResponse.novel_list
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  data() {
    return {
      isMobile: false,
      novelDetail: null,
      novelDetailInfo: null,
      clickChapterId: 0, // 点击章节id
      isInitIncentiveAd: false, // 激励广告是否初始化
      novelChapterList: [],
      isShowAdBreak: false, // 是否展示了adbreak广告
      startReadPath: "/", // 开始阅读路径
      currentRecIndex: 0, // 移动端rec模块当前索引
      changeCurrentRecIndexTimer: null,
      changeCurrentRecIndexInterval: 3000,
      isShowChapterPopup: false, // 移动端章节弹窗
      distanceFromTop: 0, // body距离顶部距离
      ratingBook: false,
      showRecommendBox: false
    };
  },
  computed: {
    chapterContent() {
      let content = this.novelDetail?.first_chapter_content;
      content = content?.replace(/\n/g, "<p class='br'></p>");
      return content;
    },
    novelUpdatedDate() {
      const date = new Date(this.novelDetailInfo.updated_at).toISOString().split("T")[0];
      return date;
    },
    firstP() {
      const parts = this.chapterContent?.split(/(<p[^>]*>.*?<\/p>)/gs);
      return parts?.[0];
    },
    otherP() {
      const parts = this.chapterContent
        ?.split(/(<p[^>]*>.*?<\/p>)/gs)
        .filter((item) => item != " ");
      let currentTextLength = 0;
      const maxTextLength = 1000;

      return parts
        ?.map((item, index) => {
          if (currentTextLength > maxTextLength || index === 0) {
            return "";
          } else {
            if (!item.includes("<p class='br'></p>")) {
              currentTextLength += item.length;
            }
            return item;
          }
        })
        .join("");
    }
  },
  watch: {
    isMobile(newVal) {
      if (newVal) {
        this.setChangeCurrentRecIndexTimer();
      } else {
        this.clearChangeCurrentRecIndexTimer();
      }
    }
  },
  created() {
    if (process.client) {
      this.getNovelDetailInfo();
    }
  },
  mounted() {
    // this.configAdBreak();
    window.dataLayer.push({
      event: "Novel_Intro_Page",
      hi_ttclid: window.getValueByURLOrCookie("ttclid"),
      hi_ip: window.getValueByURLOrCookie("ip")
    });
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    getStarListStyle,
    getStarScore,
    handleResize() {
      if (window.innerWidth <= 750) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    },
    handleRatingBook() {
      this.ratingBook = true;
    },
    handleCloseRatingBook(val) {
      this.ratingBook = false;
      saveNovelScore({
        novel_id: this.novelDetailInfo.id,
        score: String(val)
      }).then(() => {
        this.novelDetail.real_score = val;
      });
    },
    async getNovelDetailInfo() {
      const novelId = this.$route.params.novel;
      await this.$axios
        .$post("/api/novel/novel_info", {
          site_id: process.env.SITE_ID,
          novel_id: Number(novelId)
        })
        .then((response) => {
          const novelDetail = response;
          this.novelDetail = novelDetail;
          this.novelDetailInfo = novelDetail.novel_info;

          this.novelChapterList = novelDetail.chapter.map((item) => {
            return { ...item, isUnlocked: true };
          });
          this.getFreeNumAndUnlocked();
          // 有记录的章节，则跳转到记录的章节
          if (novelDetail.user_last_read_chapter_num !== 0) {
            /* 查一下是否有该章节 */
            const chapter = this.novelChapterList.find(
              (item) => item.id === novelDetail.user_last_read_chapter_id
            );
            if (chapter) {
              this.startReadPath = `/read/?ch=${novelDetail.user_last_read_chapter_id}`;
            } else {
              this.startReadPath = `/read/?ch=${response.chapter[0].id}`;
            }
          }
          // 没有记录的章节，则跳转到第一章节
          else {
            this.startReadPath = `/read/?ch=${response.chapter[0].id}`;
          }
        });
    },
    // 移动端rec模块切换
    handleRecItemClick(index) {
      this.currentRecIndex = index;
      this.clearChangeCurrentRecIndexTimer();
      this.setChangeCurrentRecIndexTimer();
    },
    setChangeCurrentRecIndexTimer() {
      this.changeCurrentRecIndexTimer = setInterval(() => {
        this.currentRecIndex = (this.currentRecIndex + 1) % this.recBooks.length;
      }, this.changeCurrentRecIndexInterval);
    },
    clearChangeCurrentRecIndexTimer() {
      clearInterval(this.changeCurrentRecIndexTimer);
    },
    handleOpenRecommendBox() {
      this.showRecommendBox = true;
    },
    // 展示菜单设置
    handleShowChapterPopup() {
      this.isShowChapterPopup = true;
      this.distanceFromTop = document.documentElement.scrollTop;
      document.body.classList.add("no-scroll");
      document.body.style.top = `-${this.distanceFromTop}px`;
      this.$nextTick(() => {
        this.$refs.mobileChapterPopup.scrollToActiveChapter();
      });
    },
    handleHideChapterPopup() {
      this.isShowChapterPopup = false;
      document.body.classList.remove("no-scroll");
      window.scrollTo(0, this.distanceFromTop); // 恢复body滚动位置
    },

    // 获取免费章节以及解锁状态
    getFreeNumAndUnlocked() {
      this.novelChapterList.forEach((item) => {
        if (item.chapter_num >= 2 && item.chapter_num <= 8) {
          const isUnlocked = getIsWatchedIncentiveVideo(`${item.id}`);
          item.isUnlocked = isUnlocked;
        } else {
          item.isUnlocked = true;
        }
      });
    },
    // 激励广告关闭
    closeIncentiveAd(isGetReward) {
      if (isGetReward) {
        this.handleAfterIncentiveAd();
      }
    },
    handleOpenIncentiveAd(item) {
      this.clickChapterId = item.id;
      this.$refs.refIncentiveAd.showRewardedAd();
    },
    // 观看完激励广告，或无激励广告
    handleAfterIncentiveAd() {
      setWatchedIncentiveVideo(`${this.clickChapterId}`);
      this.getFreeNumAndUnlocked();
      simulateClick("/read/", "ch", this.clickChapterId);
    },

    // 视频播放
    configAdBreak() {
      const pushAds = function (ad) {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push(ad);
      };
      window.adBreak = window.adBreak || pushAds;
      window.adConfig = window.adConfig || pushAds;
      try {
        window.adConfig({
          preloadAdBreaks: "on",
          sound: "off",
          onReady: function () {
            console.log("adBreak ready");
          }
        });
      } catch (error) {
        console.error("adConfig error=", error);
      }
    },
    handlePlayVideo() {
      console.log("Ad start :>>", window.adBreak);
      if (this.isShowAdBreak) {
        return;
      }
      const _this = this;
      try {
        window.adBreak({
          type: "preroll",
          name: "charmnovels_preroll",
          // 广告展示前的回调
          beforeAd: function () {
            // eslint-disable-next-line no-undef
            dataLayer.push({ event: "C_AB" });
            _this.isShowAdBreak = true;
          },
          adBreakDone: function (n) {
            console.log("Ad end :>>", n.breakStatus);
          }
        });
      } catch (error) {
        console.error("Ad error :>>", error);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.module-introduce {
  position: relative;
  margin-top: 32px;
  padding: 14px 82px 0;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 263px;
    left: 0;
    @include icon(1200px, 147px, "bg-bookshelf.png");
    z-index: -1;
  }
}
.introduce-content {
  margin-bottom: 40px;
  display: flex;
}
.cover-container {
  flex-shrink: 0;
  width: 200px;
  height: 300px;
  @include book-edge(4.04px, 6px);
  overflow: visible;
  .bg-book-edge {
    content: "";
    position: absolute;
    top: 0;
    right: -78px;
    @include icon(88px, 300px, "bg-book-edge.png");
  }
}
.introduce-info {
  margin-left: 78px;
  .name {
    width: 100%;
    max-width: 610px;
    font-size: 30px;
    line-height: 40px;
    font-family: "seb";
    @include ellipsis(2);
  }
  .line {
    display: none;
  }
  .author-row {
    display: flex;
    flex-direction: column;
    gap: 19px;
    margin: 19px 0;
    font-size: 16px;
    line-height: 21px;
    color: rgba($color2, 0.6);
    & span:first-child {
      color: $color2;
      font-family: "sesb";
    }
  }
  .info-row {
    display: flex;
    gap: 60px;
    height: 43px;
    margin-bottom: 19px;
    @media screen and (min-width: 750px) and (max-width: 870px) {
      gap: 20px;
    }
    & > div {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      & p {
        font-size: 18px;
        line-height: 24px;
        font-family: "sesb";
      }
      & span {
        font-size: 12px;
        line-height: 16px;
        color: rgba($color2, 0.6);
      }
    }
    & > div:first-child {
      align-items: flex-start;
    }
    .icon-star-on,
    .icon-star-half {
      width: 24px;
      height: 24px;
    }
    .score {
      font-size: 18px;
      line-height: 24px;
    }
  }

  .btn-read {
    width: max-content;
    height: 40px;
    padding: 0 16px;
    background: $color3;
    border-radius: 8px;
    @include center;
    line-height: 21px;
    font-family: "seb";
    color: $color1;
    .icon-read-book {
      @include icon(24px, 24px, "icon-read-book.png");
      margin-right: 8px;
    }
  }
}

.google-ad {
  margin-bottom: 19px;
}

.video-container {
  width: 600px;
  height: 400px;
  margin: 19px auto 0;
  @include center;
}
.desc {
  line-height: 21px;
  font-family: "sesb";
}

@media screen and (max-width: 750px) {
  main {
    padding-top: 0;
    padding-bottom: vw(112);
  }
  .module-introduce {
    position: relative;
    margin-top: vw(48);
    padding: 0 vw(46);
    &::before {
      display: none;
    }
  }
  .introduce-content {
    margin-bottom: vw(48);
  }
  .cover-container {
    width: vw(240);
    height: vw(304);
    @include book-edge(vw(4.85), vw(6));
    overflow: hidden;
    border-radius: vw(8);
    .bg-book-edge {
      display: none;
    }
  }
  .introduce-info {
    display: flex;
    flex-direction: column;
    margin-left: vw(24);
    .name {
      width: vw(394);
      max-width: unset;
      font-size: vw(32);
      line-height: vw(39);
    }
    .line {
      display: block;
      width: vw(2);
      height: vw(20);
      background: rgba($color2, 0.1);
    }
    .author-row {
      flex-direction: row;
      align-items: center;
      gap: vw(12);
      margin: vw(16) 0 vw(4);
      font-size: vw(24);
      line-height: vw(32);
      & span:first-child {
        color: $color2;
        font-family: "se";
      }
    }

    .updated-time-row {
      margin: 0 0 vw(16);
    }
    .latest-chapter {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      font-weight: 400;
      font-size: vw(26);
      color: #ff9345;
      height: vw(48);
      line-height: vw(48);
      text-decoration: underline;
      .icon-arrow-right {
        @include icon(vw(48), vw(48), "icon-arrow-right.png");
      }
    }
    .novel-status {
      margin-top: vw(32);
      line-height: vw(36);
      font-size: vw(26);
      font-weight: bold;
      color: $color2;
      span:last-child {
        /*font-weight: 400;*/
      }
    }

    .rating-mobile {
      margin: auto 0 vw(24);
    }
    .info-row {
      display: flex;
      gap: 0;
      height: vw(68);
      margin-bottom: 0;
      & > div {
        width: vw(160);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        & p {
          font-size: vw(28);
          line-height: vw(32);
        }
        & span {
          font-size: vw(24);
          line-height: vw(32);
        }
      }
      .icon-star-on,
      .icon-star-half {
        width: vw(32);
        height: vw(32);
      }
      .score {
        font-size: vw(24);
        line-height: vw(32);
      }
    }
    .btn-read {
      display: none;
    }
  }

  .novel-info-rating {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    height: vw(60);
    line-height: vw(30);
    margin-bottom: vw(32);
    font-size: vw(28);
    text-align: left;
    color: $color2;
    font-weight: bold;
    .novel-info-user {
      width: vw(179);
    }
    .line {
      width: vw(2);
      height: 100%;
      margin: 0 vw(40);
      background: $color2;
    }
    .novel-info-rating-box {
      .score {
        color: $color2;
        font-size: vw(28);
      }
      .rating-book {
        color: rgba($color2, 0.6);
        text-decoration: underline;
        font-size: vw(26);
      }
    }
  }

  .google-ad {
    width: 100vw;
    margin-left: vw(-46);
    margin-bottom: vw(48);
  }

  .video-container {
    width: 100%;
    height: vw(440);
    margin-top: vw(38);
  }

  .module-rec-mobile {
    margin-bottom: vw(44);
    .module-rec-list {
      display: flex;
      align-items: center;
      gap: vw(24);
      margin-bottom: vw(48);
    }
    .cover {
      width: vw(112);
      height: vw(168);
      border-radius: vw(4);
      @include book-edge(vw(2.26), vw(4));
      transition: all 0.3s;
    }
    .active {
      transform: scale(1.17);
      border: vw(4) solid $color3;
    }
  }

  .bottom-menu {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: vw(112);
    display: flex;
    gap: vw(2);
    background: $color4;
    .menu-item {
      background: $color3;
      @include center;
      gap: vw(16);
      font-size: vw(32);
      line-height: vw(42);
      font-family: "seb";
      color: $color1;
      border-radius: vw(80);
      width: vw(658);
      &:first-child {
        width: vw(272);
      }
      &:last-child {
        flex: 1;
      }
    }
    .icon-chapters {
      @include icon(vw(48), vw(48), "icon-chapter.png");
    }
    .icon-reading {
      @include icon(vw(48), vw(48), "icon-read-book.png");
    }
  }

  /* 章节 */
  .chapter-list-popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 12;
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
  .novel-info {
    padding: vw(32) vw(46);
    .novel-info-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: vw(48);
      .left-title {
        font-size: vw(28);
        color: $color2;
        font-weight: bold;
      }
      .right-btn {
        display: flex;
        font-size: vw(26);
        align-items: center;
        height: vw(48);
        text-decoration: underline;
        color: $color3;
        .icon-arrow-right {
          @include icon(vw(48), vw(48), "icon-arrow-right.png");
        }
      }
    }
    .novel-content {
      font-family: serif;
      padding: vw(28) 0 vw(20);
      font-size: vw(28);
      color: $color2;
      text-align: left;
      font-weight: 400;
      line-height: vw(38);
    }
    .novel-content-top {
    }
    .novel-content-bottom {
      padding-top: 0;
      ::v-deep .br {
        height: vw(14);
      }
    }
  }
}
</style>
