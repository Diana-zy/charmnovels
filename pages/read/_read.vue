<template>
  <main>
    <custom-header />
    <section class="read-container">
      <div class="fixed-bar">
        <div class="fixed-chapter">
          <i class="icon-chapter"></i>
          <span>Chapters</span>
        </div>
      </div>

      <!-- 只有第一章节才展示 top-info-->
      <div class="top-info">
        <div class="cover">
          <nuxt-img
            :src="currentApp.icon"
            :alt="currentApp.name"
            width="200"
            height="300"
            format="auto"
            fit="cover"
          />
        </div>
        <p class="name">{{ currentApp.desc }}</p>
        <span class="author">By Writer Name</span>
      </div>
      <article class="read-content">
        <h3>Chapter 0001</h3>
        <p>{{ currentApp.desc }}</p>
      </article>
      <section class="bottom-operation">
        <div class="pay-box">
          <div class="row-status">
            <i class="icon-lock"></i>
            <span>Unlock</span>
          </div>
          <div class="row-info">
            <span>$5.9</span>
            <span>Enjoy reading this novel</span>
          </div>
        </div>
        <div class="pagination-box">
          <div class="btn-change btn-disable">
            <i class="icon-prev"></i>
            <span>Previous Chapter</span>
          </div>
          <div class="btn-change">
            <span>Next Chapter</span>
            <i class="icon-next"></i>
          </div>
        </div>
      </section>
      <section class="module-related-chapters">
        <common-title-label title="Related Chapters" />
        <div class="module-related-chapters-content">
          <item-module-related-chapter
            v-for="(item, i) in allApps"
            :key="i"
            :item="item"
            :to="`/read/${item.path}/`"
          />
        </div>
      </section>
    </section>
    <common-notification />
  </main>
</template>

<script>
export default {
  async asyncData({ $axios, params, env }) {
    try {
      const path = params.read;
      const lastDashIndex = path.lastIndexOf("-");
      const id = path.substring(lastDashIndex + 1, path.length);
      const [currentAppResponse, allAppsResponse] = await Promise.all([
        $axios.$get("/api/game/detail", {
          params: {
            site_id: env.SITE_ID,
            game_id: id
          }
        }),
        $axios.$get("/api/game/all_app", {
          params: {
            site_id: env.SITE_ID,
            size: 5,
            page: 1
          }
        })
      ]);
      return {
        currentApp: currentAppResponse,
        allApps: allAppsResponse.list
      };
    } catch (error) {
      console.error("Error fetching data:", error);
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
.fixed-bar {
  position: fixed;
  top: 224px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 900px;
}
.fixed-chapter {
  position: absolute;
  top: 0;
  right: -109px;
  width: 94px;
  height: 64px;
  border-radius: 8px;
  background: $color3;
  @include center;
  flex-direction: column;
  font-size: 14px;
  line-height: 19px;
  color: $color1;
  font-family: "seb";
  cursor: pointer;
  z-index: 9;
  .icon-chapter {
    @include icon(24px, 24px, "icon-chapter.png");
  }
  @media screen and (max-width: 1170px) {
    right: 40px;
  }
  @media screen and (max-width: 750px) {
    display: none;
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
  font-family: "seb";
  text-align: center;
  @include ellipsis(2);
}
.author {
  font-size: 16px;
  line-height: 21px;
  margin-bottom: 21px;
  color: rgba($color2, 0.6);
}
.read-content {
  h3 {
    font-size: 20px;
    line-height: 26px;
    font-family: "seb";
    margin: 24px 0 16px;
  }
  p {
    font-size: 16px;
    line-height: 26px;
    font-family: serif;
  }
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
  main {
    padding-top: 0;
  }
  header {
    transform: translateY(-100%);
  }
  .read-container {
    max-width: unset;
    margin: 0;
    padding: 0 vw(46) vw(48);
    background: $color4;
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
      font-family: "sesb";
      margin: vw(16) 0 vw(32);
    }
    p {
      font-size: vw(28);
      line-height: vw(48);
    }
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
