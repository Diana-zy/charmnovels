<template>
  <header :class="{ 'theme-dark': theme === 'dark' }">
    <custom-link to="/" class="logo">
      <i></i>
    </custom-link>

    <!-- Tab -->
    <!--    <div-->
    <!--      :class="[-->
    <!--        'header-tabs',-->
    <!--        { 'header-tabs-hidden': currentPage != 'Home' && currentPage != 'Library' }-->
    <!--      ]"-->
    <!--    >-->
    <!--      <custom-link-->
    <!--        v-for="(tab, i) in tabsArr"-->
    <!--        :key="i"-->
    <!--        :to="tab.path"-->
    <!--        :class="[-->
    <!--          'tab-item',-->
    <!--          `tab-item-${tab.name}`,-->
    <!--          { 'tab-item-active': currentPage === tab.name }-->
    <!--        ]"-->
    <!--        >{{ tab.name }}</custom-link-->
    <!--      >-->
    <!--    </div>-->

    <div class="header-right">
      <common-search-input @handle-search="handleSearch" />
      <custom-link v-if="!isLogin" to="/profile/" class="btn-login m-hidden-flex"
        >Login</custom-link
      >
      <div class="avatar-container">
        <custom-link v-if="!isLogin" to="/profile/">
          <i class="avatar-a"></i>
        </custom-link>
        <custom-link v-if="isLogin" to="/profile/" class="avatar-a"></custom-link>
      </div>
    </div>
  </header>
</template>

<script>
import Storage from "@/utils/storage";
import { simulateClick } from "~/utils/utils";

export default {
  props: {
    theme: {
      type: String,
      default: "light"
    },
    currentPage: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      tabsArr: [
        {
          name: "Home",
          path: "/"
        },
        {
          name: "Library",
          path: "/library/"
        }
      ],
      isLogin: false
    };
  },
  mounted() {
    this.isLogin = Boolean(Storage.getCookie("novel_token"));
  },
  methods: {
    handleSearch(inputValue) {
      simulateClick("/search/", "text", inputValue, "search-button");
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
    z-index: -1;
    background: $color4;
    border: 1px solid rgba($color2, 0.2);
  }
}

.logo {
  @include center;
  margin-right: 40px;
  i {
    @include icon(219px, 54px, "logo-pc.png");
  }
}

.header-tabs {
  display: flex;
  gap: 21px;
  .tab-item {
    display: inline-block;
    height: 64px;
    line-height: 64px;
    font-size: 20px;
    color: rgba($color2, 0.6);
  }
  .tab-item-active {
    position: relative;
    font-family: "seb";
    color: $color3;
    &::before {
      position: absolute;
      content: "";
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: $color3;
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  margin-left: auto;
  .btn-pwa {
    width: 40px;
    height: 40px;
    margin-left: 24px;
    border-radius: 40px;
    background: rgba($color3, 0.3);
    @include center;
    cursor: pointer;
    i {
      @include icon(30px, 30px, "icon-download.png");
    }
  }
  .btn-login {
    width: 91px;
    height: 40px;
    margin-left: 24px;
    border-radius: 40px;
    @include center;
    background: $color3;
    color: $color1;
    font-size: 18px;
    font-family: "seb";
  }
}

.avatar-container {
  position: relative;
  margin-left: 24px;
  .avatar {
    @include icon(48px, 48px, "icon-avatar.png");
  }
  .avatar-a {
    @include icon(48px, 48px, "icon-avatar-a.png");
  }
}

@media screen and (max-width: 950px) {
  .logo {
    margin-right: 20px;
    i {
      @include icon(54px, 54px, "logo-m.png");
    }
  }
}

@media screen and (max-width: 750px) {
  header {
    height: vw(96);
    padding: 0 vw(46);
    &:before {
      border: none;
    }
  }
  .logo {
    margin-right: vw(48);
    i {
      @include icon(vw(80), vw(80), "logo-m.png");
    }
  }

  .header-tabs {
    position: absolute;
    top: vw(94);
    left: 0;
    width: 100%;
    padding: vw(24) vw(46) 0;
    background: $color4;
    gap: vw(40);
    border-bottom: 1px solid rgba($color2, 0.1);
    .tab-item {
      height: vw(46);
      line-height: vw(38);
      font-size: vw(28);
    }
    .tab-item-active {
      &::before {
        height: vw(4);
      }
    }
  }

  .header-tabs-hidden {
    display: none;
  }

  .header-right {
    width: 100%;
    gap: vw(32);
    ::v-deep .search-box {
      width: auto;
      flex: 1;
    }
    .btn-pwa {
      width: vw(64);
      height: vw(64);
      margin-left: 0;
      border-radius: vw(64);
      i {
        width: vw(48);
        height: vw(48);
      }
    }
  }

  .avatar-container {
    margin-left: 0;
    .avatar,
    .avatar-a {
      width: vw(80);
      height: vw(80);
    }
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 750px) {
  .theme-dark {
    &:before {
      background: $color7;
    }
    ::v-deep .search-box {
      border: 1px solid rgba($color2, 0.6);
      .search-btn {
        background: rgba($color2, 0.6);
      }
      .search-input {
        color: $color8;
        &::placeholder {
          color: rgba($color8, 0.6);
        }
      }
    }
  }
}
</style>
