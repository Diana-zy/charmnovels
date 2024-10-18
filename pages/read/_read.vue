<template>
  <main>
    <custom-header />

    <!-- PC端悬浮章节列表 -->
    <section class="fixed-bar">
      <div ref="fixedChapterBar" class="fixed-chapter" @click.stop="changeShowChapters">
        <i class="icon-chapter"></i>
        <span>Chapters</span>
      </div>
      <div v-show="isShowChapters" class="fixed-chapter-list">
        <module-read-chapter ref="fixedChapterList" />
      </div>
    </section>

    <module-read-content :current-app="currentApp" :all-apps="allApps" />
    <module-read-sidebar />
    <!-- <div class="fixed-chapter-list-m">
      <module-read-chapter />
    </div> -->
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
  },
  data() {
    return {
      isShowChapters: false
    };
  },
  mounted() {
    document.addEventListener("click", this.handleUserClickEvent);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleUserClickEvent);
  },
  methods: {
    changeShowChapters() {
      this.isShowChapters = !this.isShowChapters;
      if (this.isShowChapters) {
        this.$nextTick(() => {
          // 定位到当前阅读章节
          this.$refs.fixedChapterList.scrollToActiveChapter();
        });
      }
    },
    handleUserClickEvent(event) {
      const fixedChapterBar = this.$refs.fixedChapterBar;
      if (!fixedChapterBar.contains(event.target)) {
        this.isShowChapters = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.fixed-bar {
  position: fixed;
  top: 224px;
  left: 50%;
  z-index: 9;
  transform: translateX(-50%);
  width: 100%;
  max-width: 900px;
  @media screen and (max-width: 750px) {
    display: none;
  }
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
}
.fixed-chapter-list {
  position: absolute;
  top: 0;
  right: 0;
  @media screen and (max-width: 1170px) {
    right: 149px;
  }
}

@media screen and (max-width: 750px) {
  main {
    padding-top: 0;
  }
  header {
    transform: translateY(-100%);
  }

  /* 章节 */
  .fixed-chapter-list-m {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    &::before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background: rgba($color6, 0.6);
    }
  }
}
</style>
