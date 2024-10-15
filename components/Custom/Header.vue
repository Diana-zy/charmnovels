<template>
  <header :class="{ 'other-page-header': !isHomePage }">
    <custom-link to="/" class="logo">
      <i></i>
    </custom-link>

    <!-- Tab -->
    <div
      :class="[
        'header-tabs',
        { 'header-tabs-hidden': currentPage != 'Home' && currentPage != 'Library' }
      ]"
    >
      <custom-link
        v-for="(tab, i) in tabsArr"
        :key="i"
        :to="tab.path"
        :class="['tab-item', { 'tab-item-active': currentPage === tab.name }]"
        >{{ tab.name }}</custom-link
      >
    </div>

    <div class="header-right">
      <common-search-input @handle-search="handleSearch" />
      <custom-link to="/login/" class="btn-login m-hidden-flex">Login</custom-link>
      <div class="avatar-container">
        <custom-link v-if="!isLogin" to="/login/">
          <i class="avatar"></i>
        </custom-link>
        <i v-if="isLogin" class="avatar-a" tabindex="0"></i>
        <custom-link to="purchased-novels" class="user-menu">
          <div class="menu-item">
            <i class="icon-order"></i>
            <span>Purchased novels</span>
          </div>
          <div class="line"></div>
          <div class="menu-item">
            <i class="icon-logout"></i>
            <span>Log out</span>
          </div>
        </custom-link>
      </div>
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
          path: "/Library/"
        }
      ],
      isLogin: true
    };
  },
  methods: {
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
    &:focus-within + .user-menu {
      display: block;
    }
  }
  .user-menu {
    display: none;
    position: absolute;
    right: 0;
    top: 56px;
    width: 170px;
    border-radius: 8px;
    background: $color4;
    box-shadow: 0px 4px 16px 0px rgba(#000, 0.15);
  }
  .line {
    width: 146px;
    height: 1px;
    background: rgba($color2, 0.1);
    margin: 0 auto;
  }
  .menu-item {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-family: "sesb";
    cursor: pointer;
    &:hover {
      background: rgba($color3, 0.1);
    }
  }
  .icon-order {
    @include icon(24px, 24px, "icon-user-order.png");
    margin-left: 10px;
    margin-right: 12px;
  }
  .icon-logout {
    @include icon(24px, 24px, "icon-user-logout.png");
    margin-left: 10px;
    margin-right: 12px;
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

  .avatar-container {
    margin-left: vw(50);
    .avatar,
    .avatar-a {
      width: vw(80);
      height: vw(80);
    }
    .user-menu {
      top: vw(88);
      width: vw(340);
      border-radius: vw(16);
    }
    .line {
      width: vw(292);
    }
    .menu-item {
      height: vw(96);
      font-size: vw(28);
    }
    .icon-order,
    .icon-logout {
      width: vw(48);
      height: vw(48);
      @include icon(24px, 24px, "icon-user-order.png");
      margin-left: vw(20);
      margin-right: vw(24);
    }
  }
}
</style>

<style lang="scss" scoped>
/* 其他页面的头部 */
.other-page-header {
}
@media screen and (max-width: 750px) {
  .other-page-header {
  }
}
</style>
