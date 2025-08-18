<template>
  <header :class="{ 'theme-dark': theme === 'dark' }">
    <custom-link to="/" class="logo">
      <i></i>
    </custom-link>

    <div class="header-right">
      <custom-link to="/login/">
        <i class="avatar"></i>
      </custom-link>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: "light"
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
    border-bottom: 1px solid rgba($color2, 0.2);
  }
}

.logo {
  @include center;
  i {
    @include icon(219px, 54px, "logo-pc.png");
  }
}

.header-right {
  display: flex;
  align-items: center;
  margin-left: auto;
  .avatar {
    @include icon(48px, 48px, "icon-avatar-a.png");
  }
}

@media screen and (max-width: 750px) {
  header {
    height: vw(96);
    padding: 0 vw(46);
    &:before {
      border-bottom: vw(2) solid rgba($color2, 0.2);
    }
  }
  .logo {
    i {
      @include icon(vw(80), vw(80), "logo-m.png");
    }
  }

  .header-right {
    .avatar {
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
