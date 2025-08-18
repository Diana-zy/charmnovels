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
            :src="novelDetailInfo.cover"
            alt="cover"
          />
          <i class="bg-book-edge"></i>
        </div>
        <div class="introduce-info">
          <h3 class="name">{{ novelDetailInfo.name }}</h3>
          <div class="author-row">
            <span>{{ novelDetailInfo.category }}</span>
            <span class="line"></span>
            <span>{{ novelDetailInfo.author }}</span>
          </div>

          <div class="rating rating-mobile pc-hidden-flex">
            <i
              v-for="(item, i) in getStarListStyle(novelDetailInfo.score)"
              :key="i"
              :class="item"
              class="rating-item"
            ></i>
            <span class="score">{{ getStarScore(novelDetailInfo.score) }}</span>
          </div>

          <div class="info-row">
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

          <custom-link :to="`/read/?ch=${novelDetail.chapter[0].id}`" class="btn-read">
            <i class="icon-read-book"></i>
            <span>Read Now</span>
          </custom-link>
        </div>
      </div>

      <p class="desc m-hidden-block">{{ novelDetailInfo.intro }}</p>
      <module-expandable-text :text="novelDetailInfo.intro" class="pc-hidden-block" />
    </section>
    <section class="module-all">
      <common-title-label title="Rec Books" />
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
      <div v-if="isMobile" class="module-rec-mobile">
        <div class="module-rec-list">
          <div
            v-for="(item, i) in recBooks.slice(0, 5)"
            :key="i"
            class="item"
            @click="handleRecItemClick(i)"
          >
            <div :class="['cover', { active: i === currentRecIndex }]">
              <nuxt-img
                width="112"
                height="168"
                fit="cover"
                format="auto"
                :src="item.cover"
                :alt="item.name"
              />
            </div>
          </div>
        </div>
        <item-module-all
          :item="recBooks[currentRecIndex]"
          :index="0"
          :to="`/novel/${recBooks[currentRecIndex].id}/`"
        />
      </div>
    </section>
    <section class="bottom-menu pc-hidden-flex">
      <custom-link :to="`/read/?ch=${novelDetail.chapter[0].id}`" class="menu-item menu-read">
        <i class="icon-reading"></i>
        <span>Read Now</span>
      </custom-link>
    </section>
    <common-back-top />
  </main>
</template>

<script>
import { getStarListStyle, getStarScore, shuffleArray } from "~/utils/utils";
export default {
  async asyncData({ $axios, params, env }) {
    const novelId = params.novel;
    try {
      const [novelDetailResponse, allBooksResponse, recBooksResponse] = await Promise.all([
        $axios.$post("/api/novel/novel_info", {
          site_id: env.SITE_ID,
          novel_id: Number(novelId)
        }),
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
        })
      ]);
      const recBooks = shuffleArray(recBooksResponse.novel_list).slice(0, 5);
      return {
        novelDetail: novelDetailResponse,
        novelDetailInfo: novelDetailResponse.novel_info,
        allBooks: allBooksResponse.novel_list,
        recBooks
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
      currentRecIndex: 0, // 移动端rec模块当前索引
      changeCurrentRecIndexTimer: null,
      changeCurrentRecIndexInterval: 3000,
      isShowChapterPopup: false, // 移动端章节弹窗
      distanceFromTop: 0 // body距离顶部距离
    };
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
  mounted() {
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
    height: vw(360);
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
      font-size: vw(40);
      line-height: vw(54);
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
      margin: vw(16) 0 vw(24);
      font-size: vw(24);
      line-height: vw(32);
      & span:first-child {
        color: rgba($color2, 0.6);
        font-family: "se";
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
}
</style>
