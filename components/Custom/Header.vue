<template>
  <header :class="{ 'other-page-header': !isHomePage }">
    <custom-link to="/" class="logo">
      <i></i>
    </custom-link>

    <div class="header-right-pc">
      <div class="btn-pwa" v-if="showInstallButton" @click="installPWA">
        <i></i>
      </div>
      <common-search-input @handle-search="handleSearch" />
    </div>

    <div class="header-right-m">
      <div class="btn-pwa" v-if="showInstallButton" @click="installPWA">
        <i class="h-icon-download-m"></i>
      </div>
      <custom-link to="/search/" class="btn-search"> <i class="h-icon-search-m"></i></custom-link>
    </div>
  </header>
</template>

<script>
import { simulateClick } from "~/utils/utils";

export default {
  props: {
    isHomePage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      deferredPrompt: null,
      showInstallButton: false
    };
  },
  mounted() {
    // 判断是否支持 PWA
    if ("serviceWorker" in navigator && "PushManager" in window) {
      if (window.deferredPrompt) {
        this.deferredPrompt = window.deferredPrompt;
        this.showInstallButton = true;
      } else {
        // 如果beforeinstallprompt这个事件在window.onload后 组件mounted时未触发，则重新建立监听
        window.addEventListener("beforeinstallprompt", (e) => {
          // console.log("page - beforeinstallprompt", e);
          e.preventDefault();
          this.deferredPrompt = e;
          this.showInstallButton = true;
        });
      }
    }
  },
  methods: {
    installPWA() {
      if (this.deferredPrompt) {
        // 触发 PWA 安装提示
        this.deferredPrompt.prompt();
        // 在用户做出选择后，保存结果
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the A2HS prompt");
          } else {
            console.log("User dismissed the A2HS prompt");
          }
          // 重置 deferredPrompt
          this.deferredPrompt = null;
        });
      }
    },
    handleSearch(inputValue) {
      simulateClick("/search/", "text", inputValue);
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  z-index: 9;
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  margin: 0 auto;
  &:before {
    content: "";
    display: inline-block;
    width: 100vw;
    height: 100%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background: $color3;
    z-index: -1;
  }
}

.logo {
  @include center;
  width: 193px;
  height: 40px;
  i {
    @include icon(161px, 32px, "logo-pc.png");
  }
}

.header-right-pc {
  display: flex;
  align-items: center;
  .btn-pwa {
    width: 40px;
    height: 40px;
    margin-right: 24px;
    border-radius: 40px;
    @include center;
    @include btn-shadow-outer();
    cursor: pointer;
    &:hover {
      @include btn-shadow-inner();
    }
    i {
      @include icon(24px, 24px, "h-icon-download.png");
    }
  }
  .search-box {
    background: $color4;
  }
}

.header-right-m {
  display: none;
}

@media screen and (max-width: 750px) {
  header {
    position: relative;
    height: vw(96);
    padding: 0 vw(46);
    &:before {
      background: none;
    }
  }
  .logo {
    width: vw(384);
    height: vw(80);
    border-radius: vw(80);
    i {
      @include icon(vw(318), vw(64), "logo-m-home.png");
    }
  }
  .header-right-pc {
    display: none;
  }
  .header-right-m {
    display: flex;
    .btn-pwa,
    .btn-search {
      width: vw(80);
      height: vw(80);
      margin-left: vw(32);
      border-radius: vw(32);
      @include center;
    }
    $icons: ("h-icon-download-m", "h-icon-search-m");
    @each $icon in $icons {
      .#{$icon} {
        @include icon(vw(48), vw(48), "#{$icon}.png");
      }
    }
  }
}
</style>

<style lang="scss" scoped>
/* 其他页面的头部 */
.other-page-header {
  position: fixed;
  .logo {
    border-radius: 40px;
    @include btn-shadow-outer;
    &:hover {
      @include btn-shadow-inner;
    }
  }
}
@media screen and (max-width: 750px) {
  .other-page-header {
    &:before {
      background: $color4;
    }
    .logo {
      @include border;
      @include shadow-outer;
      &:hover {
        @include shadow-inner;
      }
      i {
        @include icon(vw(318), vw(64), "logo-m-other.png");
      }
    }
    .btn-pwa,
    .btn-search {
      @include border;
      @include shadow-outer;
      &:hover {
        @include shadow-inner;
      }
    }
  }
}
</style>
