<template>
  <main>
    <custom-header />
    <common-breadcrumb :name="currentSoftware.name" />

    <section class="main-left">
      <google-ad class="ad-1" ad-slot="3297497936" />

      <section class="game-introduction">
        <div class="application-info">
          <nuxt-img
            class="icon"
            width="186"
            height="186"
            :src="currentSoftware.icon"
            :alt="currentSoftware.name"
            fit="cover"
            format="auto"
          />
          <div class="content">
            <h3>{{ currentSoftware.name }}</h3>
            <div class="download-info">
              <p>
                <span>Version:</span>
                <b>{{ currentSoftware.version }}</b>
              </p>
              <p>
                <span>Size:</span>
                <b>{{ currentSoftware.apk_size }}</b>
              </p>
              <p>
                <span>Updated:</span>
                <b>{{ currentSoftware.updated_time }}</b>
              </p>
            </div>
            <div class="download-buttons">
              <div v-if="currentSoftware.android" class="android">
                <i class="icon-android"></i>
                <span>Android</span>
                <div class="qrcode">
                  Android
                  <img :src="qrCodeGoogle" alt="qrcode" />
                </div>
                <a :href="currentSoftware.android_web_url"></a>
              </div>

              <div v-if="currentSoftware.ios" class="ios">
                <i class="icon-ios"></i>
                <span>IOS</span>
                <div class="qrcode">
                  IOS
                  <img :src="qrCodeIos" alt="qrcode" />
                </div>
                <a :href="currentSoftware.ios_web_url"></a>
              </div>
            </div>
          </div>
        </div>

        <module-expandable-text :text="currentSoftware.desc" />
      </section>

      <section class="module-common module-new">
        <common-title-label title="New Wallpapers" to="/new/" />
        <div class="module-new-content new-content-pc m-hidden-grid">
          <item-module-common
            v-for="(item, i) in newApps"
            :key="i"
            :item="item"
            :index="i"
            :to="`/app/${item.path}/`"
          />
        </div>

        <div class="module-new-content pc-hidden-flex">
          <item-module-new-mobile
            v-for="(item, i) in newApps.slice(0, 5)"
            :key="i"
            :item="item"
            :to="`/app/${item.path}/`"
          />
        </div>
      </section>

      <div ref="targetElement">
        <google-ad ad-slot="2955836717" />
      </div>

      <section class="module-all">
        <common-title-label title="Trending Apps" />
        <common-infinite-scroll-list
          api-endpoint="/api/game/all_app"
          :initial-page="2"
          :page-size="12"
          :initial-items="allApps"
          class="module-all-content"
        >
          <template #default="{ items }">
            <item-module-all
              v-for="(item, i) in items"
              :key="i"
              :item="item"
              :index="i"
              :to="`/app/${item.path}/`"
            />
          </template>
        </common-infinite-scroll-list>
      </section>
    </section>

    <section class="main-right">
      <google-ad ad-slot="3489069628" />
      <common-title-label title="Selected Collection" />
      <div class="collection-list">
        <item-module-collection
          v-for="(item, i) in collectionList"
          :key="i"
          :index="i"
          :item="item"
          :to="`/collection/${item.path}/`"
        />
      </div>
    </section>

    <custom-footer />
    <common-back-top />
    <ad-loading />
  </main>
</template>

<script>
import QRCode from "qrcode";
import { shuffleArray } from "~/utils/utils";

export default {
  data() {
    return {
      qrCodeGoogle: "",
      qrCodeIos: ""
    };
  },
  methods: {
    async generateQRCode(url) {
      try {
        // 使用 qrcode 库生成二维码数据
        const qrCodeDataURL = await QRCode.toDataURL(url);
        // 将二维码数据设置到组件的数据中
        return qrCodeDataURL;
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    }
  },
  async asyncData({ $axios, params, env }) {
    try {
      const path = params.download;
      const lastDashIndex = path.lastIndexOf("-");
      const id = path.substring(lastDashIndex + 1, path.length);

      const [currentAppResponse, collectionResponse, newAppsResponse, allAppsResponse] =
        await Promise.all([
          $axios.$get("/api/game/detail", {
            params: {
              site_id: env.SITE_ID,
              game_id: id
            }
          }),
          $axios.$get("/api/game/all_app_collection", {
            params: {
              site_id: env.SITE_ID
            }
          }),
          $axios.$get("/api/game/menu", {
            params: {
              site_id: env.SITE_ID,
              mod_id: "new"
            }
          }),
          $axios.$get("/api/game/all_app", {
            params: {
              site_id: env.SITE_ID,
              size: 12,
              page: 1
            }
          })
        ]);
      return {
        currentSoftware: currentAppResponse,
        collectionList: shuffleArray(collectionResponse.list).slice(0, 8),
        newApps: shuffleArray(newAppsResponse.list).slice(0, 10),
        allApps: allAppsResponse.list
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  mounted() {
    if (this.currentSoftware.ios_web_url) {
      this.generateQRCode(this.currentSoftware.ios_web_url).then((data) => {
        this.qrCodeIos = data;
      });
    }
    if (this.currentSoftware.android_web_url) {
      this.generateQRCode(this.currentSoftware.android_web_url).then((data) => {
        this.qrCodeGoogle = data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/css/download.scss";
</style>
