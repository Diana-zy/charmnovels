<template>
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
          <span>By：{{ novelDetailInfo.author }}</span>
        </div>
        <div class="author-row updated-time-row">
          <span>Latest Updated： {{ novelUpdatedDate }}</span>
        </div>

        <!--          最新章节 -->
        <!-- <div class="latest-chapter pc-hidden-flex" @click="handleShowChapterPopup('top')">
          <div>Latest Chapter：Chapter {{ novelChapterList.length }}</div>
          <div class="icon-arrow-right"> </div>
        </div> -->
        <div class="tips-box">
          <div class="tips">{{ novelDetailInfo.category }}</div>
        </div>

        <!--          是否连载-->
        <div class="novel-status pc-hidden-block">
          <span>{{ novelDetailInfo.is_complete ? "Completed!" : "Update Just Now!" }}</span>
        </div>

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
      </div>
    </div>

    <p class="desc m-hidden-block">{{ novelDetailInfo.intro }}</p>
    <module-expandable-text
      :text="novelDetailInfo.intro"
      :novel-detail-info="novelDetailInfo"
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
          </div>
        </div>
      </div>
    </module-expandable-text>
  </section>
</template>

<script>
import { getStarListStyle, getStarScore } from "~/utils/utils";
export default {
  props: {
    novelDetailInfo: {
      type: Object,
      default: null
    }
  },
  computed: {
    novelUpdatedDate() {
      const date = new Date(this.novelDetailInfo.updated_at).toISOString().split("T")[0];
      return date;
    }
  },
  methods: {
    getStarListStyle,
    getStarScore
  }
};
</script>

<style scoped lang="scss">
.module-introduce {
  background-color: $color1;
  padding: 48px 82px 0;
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
@media screen and (max-width: 750px) {
  .module-introduce {
    position: relative;
    padding: vw(48) vw(46);
    border-radius: vw(48) vw(48) 0 0;
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
      div:last-child {
        font-weight: normal;
      }
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

  .tips-box {
    display: flex;
    align-items: center;
    height: vw(50);
    .tips {
      line-height: vw(50);
      color: $color1;
      font-size: vw(24);
      flex-shrink: 0;
      padding: 0 vw(54);
      background: rgba(#ffa463, 0.9);
      border-radius: vw(22);
      font-weight: 600;
    }
  }
}
</style>
