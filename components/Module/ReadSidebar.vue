<template>
  <div>
    <div class="bottom-setting">
      <div class="mask"></div>
      <div class="content">
        <div class="progress-box">
          <span>{{ readProgress }}%</span>
          <div :style="`--progress-width:${readProgress}%`" class="progress-bar"></div>
        </div>
        <div class="menu-box">
          <div class="menu-item"><i class="icon-sidebar-chapter"></i></div>
          <div class="menu-item"><i class="icon-sidebar-theme"></i></div>
          <div class="menu-item" @click="handleChangeDarkTheme"
            ><i :class="[isDarkTheme ? 'icon-sidebar-light' : 'icon-sidebar-dark']"></i
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Storage from "@/utils/storage";
export default {
  data() {
    return {
      readProgress: 88.8,
      isDarkTheme: false,
      themeColor: [
        /* dark */
        {
          bgColor: "#0f0f0f",
          textColor: "#6E6E6E"
        },
        /* 常规 */
        {
          bgColor: "#fffcf7",
          textColor: "#41414c"
        },
        {
          bgColor: "#CCDCBE",
          textColor: "#41414C"
        },
        {
          bgColor: "#393335",
          textColor: "#928D8B"
        }
      ],
      themeColorIndex: 0
    };
  },
  created() {},
  mounted() {
    this.getReadThemeColor();
  },
  methods: {
    /* 打开设置时调用 */
    getReadThemeColor() {
      const readThemeColor = Storage.getItem("novel_cssReadBackgroundColor");
      if (readThemeColor) {
        this.isDarkTheme = readThemeColor === this.themeColor[0].bgColor;
        this.themeColorIndex = this.themeColor.findIndex((item) => item.bgColor === readThemeColor);
      } else {
        this.isDarkTheme = false;
      }
    },
    /* 字体大小 */
    handleChangeFontSize(value) {
      const root = document.documentElement;
      root.style.setProperty("--read-font-size", value + "px");
      Storage.setItem("novel_cssReadFontSize", value);
    },
    /* 字体间距 */
    handleChangeSpace(value) {
      const root = document.documentElement;
      root.style.setProperty("--read-font-space", value);
      Storage.setItem("novel_cssReadFontSpace", value);
    },

    /* TODO: 切换到白天模式，要获取上一次的白天主题 */
    /* 切换昼夜主题 */
    handleChangeDarkTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      const root = document.documentElement;
      const themeIndex = this.isDarkTheme ? 0 : 1;
      const themeBgColor = this.themeColor[themeIndex].bgColor;
      const themeTextColor = this.themeColor[themeIndex].textColor;
      root.style.setProperty("--read-bg-color", themeBgColor);
      root.style.setProperty("--read-text-color", themeTextColor);
      Storage.getItem("novel_cssReadBackgroundColor") ||
        Storage.setItem("novel_cssReadBackgroundColor", themeBgColor);
      Storage.getItem("novel_cssReadTextColor") ||
        Storage.setItem("novel_cssReadTextColor", themeTextColor);
    }
  }
};
</script>

<style scoped lang="scss">
@media screen and (max-width: 750px) {
  .bottom-setting {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 10;
    color: $color8;
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba($color6, 0.4);
    }
    .content {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: vw(24) vw(46) vw(22);
      background: $color7;
    }
    .progress-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: vw(28);
      line-height: vw(38);
      font-family: "sesb";
      .progress-bar {
        position: relative;
        width: 100%;
        height: vw(12);
        margin-top: vw(8);
        background: #434343;
        border-radius: vw(8);
        &::before {
          position: absolute;
          left: 0;
          top: 0;
          content: "";
          width: var(--progress-width);
          height: 100%;
          border-radius: vw(8);
          background: $color3;
        }
      }
    }
    .menu-box {
      display: flex;
      height: vw(96);
      .menu-item {
        flex: 1;
        @include center;
      }
      $menuIcons: (
        "icon-sidebar-chapter",
        "icon-sidebar-theme",
        "icon-sidebar-light",
        "icon-sidebar-dark"
      );
      @each $icon in $menuIcons {
        .#{$icon} {
          @include icon(vw(48), vw(48), "#{$icon}.png");
        }
      }
    }
  }
}
</style>
