<template>
  <main>
    <custom-header />
    <section class="module-introduce">
      <div class="introduce-content">
        <div class="cover-container">
          <nuxt-img
            class="cover"
            width="200"
            height="300"
            fit="cover"
            format="auto"
            :src="allApps[0].icon"
            alt="cover"
          />
          <i class="bg-book-edge"></i>
        </div>
        <div class="introduce-info">
          <h3 class="name"
            >Accidentally Marked By The Alpha King Accidentally Marked By The Alpha King</h3
          >
          <div class="author-row">
            <span>Romance</span>
            <span class="line"></span>
            <span>Writer Name</span>
          </div>

          <div class="info-row">
            <div>
              <div class="rating">
                <i
                  v-for="(item, i) in getStarListStyle(4.6)"
                  :key="i"
                  :class="item"
                  class="rating-item"
                ></i>
                <span class="score">{{ getStarScore(4.6) }}</span>
              </div>
              <span>Score</span>
            </div>
            <div>
              <p>85</p>
              <span>Chapters</span>
            </div>
            <div>
              <p>38.8K</p>
              <span>Views</span>
            </div>
          </div>

          <div class="btn-read">
            <i class="icon-read-book"></i>
            <span>Start Reading</span>
          </div>
        </div>
      </div>
      <div class="video-container">视频占位</div>
      <p class="desc m-hidden-block">{{ textData }}</p>
      <module-expandable-text :text="textData" class="pc-hidden-block" />
    </section>
    <section class="module-all">
      <common-title-label title="Rec Books" />
      <common-infinite-scroll-list
        v-if="!isMobile"
        api-endpoint="/api/game/all_app"
        :initial-page="2"
        :page-size="16"
        :initial-items="allApps"
        class="module-all-content"
      >
        <template #default="{ items }">
          <item-module-all
            v-for="(item, i) in items"
            :key="i"
            :item="item"
            :index="i"
            :to="`/read/${item.path}/`"
          />
        </template>
      </common-infinite-scroll-list>
    </section>

    <!-- 移动端章节弹窗 -->
    <transition name="fade">
      <div v-show="isShowChapterPopup" class="chapter-list-popup">
        <div class="mask" @click="handleHideChapterPopup"></div>
        <transition name="slide">
          <module-read-chapter
            v-show="isShowChapterPopup"
            @close-chapter-popup="handleHideChapterPopup"
          />
        </transition>
      </div>
    </transition>
    <section class="bottom-menu">
      <div class="menu-item" @click="handleShowChapterPopup">
        <i class="icon-chapters"></i>
        <span>Chapters</span>
      </div>
      <div class="menu-item">
        <i class="icon-reading"></i>
        <span>Start Reading</span>
      </div>
    </section>
    <common-notification />
    <ad-loading />
    <common-back-top />
  </main>
</template>

<script>
import { getStarListStyle, getStarScore } from "~/utils/utils";
export default {
  async asyncData({ $axios, env }) {
    try {
      const [allAppsResponse] = await Promise.all([
        $axios.$get("/api/game/all_app", {
          params: {
            site_id: env.SITE_ID,
            size: 16,
            page: 1
          }
        })
      ]);
      return {
        allApps: allAppsResponse.list
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  data() {
    return {
      textData:
        "'Please believe me. I didn't do anything!' Thalassa Thompson cried helplessly. 'Take her away.' Kris Miller, her husband, said coldly. He didn't care as she was humiliated for the whole world to see. What would you if the love of your life and the woman you considered your best friend betrayed you in the worse way possible? For Thalassa, the answer was only one; she's going to come back stronger and better and bring everyone who made her suffer to their knees. Let the games begin! ***** 'I hate you.' Kris gritted out, glaring into her eyes. Thalassa laughed. 'Mr Miller, if you hate me so much, then why is your dick so hard?",
      isMobile: false,
      isShowChapterPopup: false, // 移动端章节弹窗
      distanceFromTop: 0 // body距离顶部距离
    };
  },
  mounted() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    getStarListStyle,
    getStarScore,
    handleResize() {
      console.log(window.innerWidth);
      if (window.innerWidth <= 750) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    },

    // 展示菜单设置
    handleShowChapterPopup() {
      this.isShowChapterPopup = true;
      this.distanceFromTop = document.documentElement.scrollTop;
      document.body.classList.add("no-scroll");
      document.body.style.top = `-${this.distanceFromTop}px`;
    },
    handleHideChapterPopup() {
      this.isShowChapterPopup = false;
      document.body.classList.remove("no-scroll");
      window.scrollTo(0, this.distanceFromTop); // 恢复滚动位置
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
    .rating-item {
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
    cursor: pointer;
    .icon-read-book {
      @include icon(24px, 24px, "icon-read-book.png");
      margin-right: 8px;
    }
  }
}
.video-container {
  height: 160px;
  margin-bottom: 19px;
  background: $color3;
  @include center;
}
.desc {
  line-height: 21px;
  font-family: "sesb";
}

@media screen and (max-width: 750px) {
  main {
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
    flex-direction: column;
    align-items: center;
  }
  .cover-container {
    width: vw(240);
    height: vw(360);
    @include book-edge(vw(4.85), vw(6));
    overflow: hidden;
    border-radius: vw(8);
    .bg-book-edge {
      display: none;
    }
  }
  .introduce-info {
    margin-left: 0;
    .name {
      width: 100%;
      max-width: unset;
      font-size: vw(32);
      line-height: vw(42);
      margin-top: vw(24);
      padding: 0 vw(24);
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
      justify-content: center;
      gap: vw(12);
      margin: vw(12) 0 vw(30);
      font-size: vw(24);
      line-height: vw(32);
      & span:first-child {
        color: rgba($color2, 0.6);
        font-family: "se";
      }
    }
    .info-row {
      display: flex;
      gap: 0;
      height: vw(68);
      margin-bottom: 0;
      & > div {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        & p {
          font-size: vw(28);
          line-height: vw(32);
        }
        & span {
          font-size: vw(24);
          line-height: vw(32);
        }
      }
      & > div:first-child {
        flex: 1;
        align-items: center;
      }
      .rating-item {
        width: vw(32);
        height: vw(32);
      }
      .score {
        font-size: vw(24);
        line-height: vw(32);
      }
      & > div:nth-of-type(n + 2) {
        flex-shrink: 0;
        width: vw(198);
      }
    }
    .btn-read {
      display: none;
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
