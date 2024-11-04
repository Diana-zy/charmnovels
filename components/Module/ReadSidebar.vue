<template>
  <div>
    <transition name="fade">
      <div v-show="isShowMenuSetting" class="bottom-setting">
        <div class="mask" @click="hideMenuSetting"></div>
        <transition name="slide">
          <div v-show="isShowMenuSetting" class="content">
            <div class="progress-box">
              <span>{{ currentReadProgress }}%</span>
              <div :style="`--progress-width:${currentReadProgress}%`" class="progress-bar"></div>
            </div>
            <div class="menu-box">
              <div class="menu-item menu-chapters" @click="showChapterPopup"
                ><i class="icon-sidebar-chapter"></i
              ></div>
              <div class="menu-item menu-style" @click="showStyleSetting">
                <i class="icon-sidebar-theme"></i>
              </div>
              <div class="menu-item menu-theme" @click="handleChangeDarkTheme"
                ><i :class="[isDarkTheme ? 'icon-sidebar-light' : 'icon-sidebar-dark']"></i
              ></div>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- 主题样式设置 -->
    <transition name="fade">
      <div v-show="isShowStyleSetting" class="bottom-setting">
        <div class="mask" @click="hideStyleSetting"></div>
        <transition name="slide">
          <div v-show="isShowStyleSetting" class="content content_style-setting">
            <div class="setting-row">
              <!-- 主题颜色 -->
              <div class="theme-box">
                <div
                  v-for="(item, index) in themeColor.slice(1)"
                  :key="index"
                  :class="['theme-item', { 'theme-item-active': index + 1 === themeColorIndex }]"
                  :style="{ 'background-color': item.bgColor }"
                  @click="handleChangeThemeColor(item, index + 1)"
                >
                  <i :class="[item.theme === 'brown' ? 'icon-T-dark' : 'icon-T-light']"></i>
                </div>
              </div>
              <!-- 字体大小 -->
              <div class="font-size-box">
                <i
                  :class="[
                    'icon-font-size-minus',
                    { 'icon-font-size-disabled': currentFontSize === 14 }
                  ]"
                  @click="handleChangeFontSize(Number(currentFontSize) - 1)"
                ></i>
                <span>{{ currentFontSize }}</span>
                <i
                  :class="[
                    'icon-font-size-plus',
                    { 'icon-font-size-disabled': currentFontSize === 28 }
                  ]"
                  @click="handleChangeFontSize(Number(currentFontSize) + 1)"
                ></i>
              </div>
            </div>
            <!-- 文本行高 -->
            <div class="font-space-box">
              <div
                v-for="(item, i) in [1.5, 2, 2.5]"
                :key="item"
                :class="['space-item', { 'space-item-active': item === currentFontSpace }]"
                @click="handleChangeSpace(item)"
              >
                <i :class="`icon-light-height-${i + 1}`"></i>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import Storage from "@/utils/storage";
export default {
  props: {
    currentReadProgress: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      isShowMenuSetting: false,
      isShowStyleSetting: false,
      isDarkTheme: false,
      themeColor: [
        /* dark */
        {
          theme: "dark",
          bgColor: "#0f0f0f",
          textColor: "#6E6E6E"
        },
        /* 常规 */
        {
          theme: "light",
          bgColor: "#fffcf7",
          textColor: "#41414c"
        },
        {
          theme: "green",
          bgColor: "#CCDCBE",
          textColor: "#41414C"
        },
        {
          theme: "brown",
          bgColor: "#393335",
          textColor: "#928D8B"
        }
      ],
      themeColorIndex: 1,
      currentFontSize: 15,
      currentFontSpace: 2
    };
  },
  mounted() {},
  methods: {
    getReadThemeColor() {
      const readThemeColor = Storage.getCookie("novel_cssReadBackgroundColor");
      if (readThemeColor) {
        this.isDarkTheme = readThemeColor === this.themeColor[0].bgColor;
        this.themeColorIndex = this.themeColor.findIndex((item) => item.bgColor === readThemeColor);
      } else {
        this.isDarkTheme = false;
      }
    },
    getReadFontSize() {
      const readFontSize = Storage.getCookie("novel_cssReadFontSize");
      this.currentFontSize = readFontSize || 16;
    },
    getReadFontSpace() {
      const readFontSpace = Storage.getCookie("novel_cssReadFontSpace");
      this.currentFontSpace = readFontSpace ? Number(readFontSpace) : 1;
    },
    initReadSetting() {
      this.getReadThemeColor();
      this.getReadFontSize();
      this.getReadFontSpace();
    },
    /* 主题颜色 */
    handleChangeThemeColor(item, index) {
      this.themeColorIndex = index;
      const root = document.documentElement;
      root.style.setProperty("--read-bg-color", item.bgColor);
      root.style.setProperty("--read-text-color", item.textColor);
      Storage.setCookie("novel_cssReadBackgroundColor", item.bgColor);
      Storage.setCookie("novel_cssReadTextColor", item.textColor);
      Storage.setCookie("novel_cssReadLastTheme", item.theme);
    },
    /* 字体大小 */
    handleChangeFontSize(value) {
      console.log(value);
      const root = document.documentElement;
      if (value < 14 || value > 28) {
        return;
      }
      this.currentFontSize = value;
      root.style.setProperty("--read-font-size", value + "px");
      Storage.setCookie("novel_cssReadFontSize", value);
    },
    /* 字体间距 */
    handleChangeSpace(value) {
      const root = document.documentElement;
      this.currentFontSpace = value;
      root.style.setProperty("--read-font-space", value);
      Storage.setCookie("novel_cssReadFontSpace", value);
    },

    /* 切换昼夜主题 */
    handleChangeDarkTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      const root = document.documentElement;
      let themeIndex;
      // 夜间模式
      if (this.isDarkTheme) {
        themeIndex = 0;
      }
      // 日间模式
      else {
        const lastTheme = Storage.getCookie("novel_cssReadLastTheme");
        themeIndex = this.themeColor.findIndex((item) => item.theme === lastTheme);
      }

      const themeBgColor = this.themeColor[themeIndex].bgColor;
      const themeTextColor = this.themeColor[themeIndex].textColor;
      root.style.setProperty("--read-bg-color", themeBgColor);
      root.style.setProperty("--read-text-color", themeTextColor);
      Storage.setCookie("novel_cssReadBackgroundColor", themeBgColor);
      Storage.setCookie("novel_cssReadTextColor", themeTextColor);
    },

    /* 显示设置 */
    showMenuSetting() {
      this.isShowMenuSetting = true;
      this.getReadThemeColor(); // 刷新昼夜模式
    },
    showStyleSetting() {
      this.isShowStyleSetting = true;
      this.isShowMenuSetting = false;
      this.initReadSetting(); // 刷新style设置
    },
    hideMenuSetting() {
      this.isShowMenuSetting = false;
      this.$emit("hide-menu-setting");
    },
    hideStyleSetting() {
      this.isShowStyleSetting = false;
      this.$emit("hide-style-setting");
    },
    // 打开章节弹窗
    showChapterPopup() {
      this.isShowMenuSetting = false;
      this.$emit("show-chapter-popup");
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

    /* 主题背景文字等设置 */
    .content_style-setting {
      padding: vw(32) vw(46) vw(40);
    }
    .setting-row {
      display: flex;
      align-items: center;
    }
    .theme-box {
      @include center;
      gap: vw(32);
      .theme-item {
        width: vw(92);
        height: vw(56);
        border-radius: vw(56);
        @include center;
        .icon-T-dark {
          @include icon(vw(32), vw(32), "icon-T-dark.png");
        }
        .icon-T-light {
          @include icon(vw(32), vw(32), "icon-T-light.png");
        }
      }
      .theme-item-active {
        border: 1px solid $color3;
      }
    }
    .font-size-box {
      width: vw(266);
      height: vw(64);
      border-radius: vw(64);
      background: #2c2c2c;
      margin-left: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 vw(32);
      @each $type in ("minus", "plus") {
        .icon-font-size-#{$type} {
          @include icon(vw(32), vw(32), "icon-font-size-#{$type}.png");
        }
      }
      .icon-font-size-disabled {
        opacity: 0.4;
      }
      span {
        font-size: vw(38);
        line-height: vw(50);
        font-family: "sesb";
        color: $color1;
      }
    }
    .font-space-box {
      display: flex;
      align-items: center;
      margin-top: vw(32);
      gap: vw(32);
      .space-item {
        width: vw(92);
        height: vw(56);
        border-radius: vw(56);
        background: #2c2c2c;
        @include center;
      }
      .space-item-active {
        border: 1px solid $color3;
      }

      @each $i in 1 2 3 {
        .icon-light-height-#{$i} {
          @include icon(vw(32), vw(32), "icon-light-height-#{$i}.png");
        }
      }
    }
  }
}
</style>
