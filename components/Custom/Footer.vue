<template>
  <footer>
    <div class="subscription">
      <div class="subscription-content">
        <p class="text">SUBSCRIPTION</p>
        <div class="search-box">
          <input v-model="input" class="email" placeholder="Email address" />
          <div class="submit" @click="submitEmail">
            <div class="btn-inner"> SUBMIT </div>
          </div>
        </div>
      </div>

      <div class="introduction">
        charmnovels.com is a wallpaper aggregation platform. Through this platform, you can
        download beautiful wallpapers on various devices that support Android and iOS. Our team’s
        goal is to help all users find wallpapers they love. <br />
        We offer a variety of wallpaper types, including but not limited to 3D dynamic, 4K ultra HD,
        anime animations, football stars, pink aesthetics, component parts, fluid effects, and
        personalized wallpapers. charmnovels.com has collected the hottest, most classic, and most
        interesting wallpapers, each carefully selected by us, along with collections to meet your
        needs. <br />
        charmnovels.com is a website that provides high-quality wallpaper options. The site does
        not offer downloads for wallpaper applications; the download links for wallpapers will
        redirect to official platforms like Google Play and the Apple Store. Users can quickly find
        the wallpapers that suit them best on charmnovels.com. <br />
        We hope you find wallpapers you love on the charmnovels.com platform. If you have any
        feedback for us, please feel free to contact us via email:
        <a href="mailto:Service@charmnovels.com">Service@charmnovels.com</a>
      </div>
    </div>

    <div class="copyright">
      <div>
        <CustomLink to="/eula.html" target="_blank">Terms of Service</CustomLink>
        <CustomLink to="/privacy.html" target="_blank">Privacy Policy</CustomLink
        ><CustomLink to="/cookies.html" target="_blank">Cookies Policy</CustomLink>
        <a href="mailto:Service@charmnovels.com">Contact</a>
      </div>
      <span>Copyright ©&nbsp; 2024 charmnovels &nbsp;All rights reserved.</span>
    </div>
    <common-notification v-if="showNotification" :message="notificationMessage" />
  </footer>
</template>

<script>
import { validateEmail } from "~/utils/utils";

export default {
  data() {
    return {
      input: ""
    };
  },
  computed: {
    showNotification() {
      return this.$globalData.notification.show;
    },
    notificationMessage() {
      return this.$globalData.notification.message;
    }
  },
  methods: {
    async submitEmail() {
      if (validateEmail(this.input)) {
        await this.$axios.$post("/api/game/subscribe", {
          site_id: process.env.SITE_ID,
          email: this.input
        });
        this.$globalMethod.showNotification({
          message: "Thank you for subscribing!",
          type: "success"
        });
      } else {
        this.$globalMethod.showNotification({
          message: "Please enter a valid email address",
          type: "warning"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
footer {
  padding: 16px 0 0;
  margin: 32px auto 0;
  box-sizing: content-box;
  border-top: 1px solid rgba($color2, 0.1);
}
.subscription {
  display: flex;
  justify-content: space-between;
  flex-flow: row-reverse;
}
.introduction {
  font-size: 14px;
  line-height: 20px;
  color: rgba($color2, 0.6);
  a {
    font-family: "seb";
    color: $color2;
  }
}
.subscription-content {
  margin-left: 40px;
  .text {
    color: $color2;
    font-size: 20px;
    font-family: "seb";
    margin-bottom: 16px;
  }

  .search-box {
    position: relative;
    width: 390px;
    height: 40px;
    @include shadow-inner;
    border-radius: 40px;
    .email {
      position: absolute;
      width: 100%;
      height: 100%;
      font-size: 14px;
      padding-left: 16px;
      padding-right: 122px;
      &::placeholder {
        color: rgba($color2, 0.4);
      }
    }
    .submit {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 118px;
      height: 32px;
      color: $color1;
      font-size: 16px;
      font-family: "sesb";
      border-radius: 32px;
      background: $color3;
      @include center;
      cursor: pointer;
    }
  }
}

.copyright {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  color: $color2;
  font-size: 14px;
  line-height: 20px;
  a {
    &::after {
      content: "|";
      margin-left: 8px;
      margin-right: 8px;
    }
    &:last-child {
      &::after {
        content: "";
      }
    }
  }
}

@media screen and (max-width: 750px) {
  footer {
    padding: 0 vw(46);
    margin-top: vw(46);
    border: none;
  }
  .introduction {
    font-size: vw(24);
    line-height: vw(32);
    margin: vw(24) 0 0;
  }
  .subscription {
    flex-flow: column;
  }
  .subscription-content {
    margin-left: 0;
    .text {
      font-size: vw(28);
      margin-bottom: vw(20);
    }
    .search-box {
      width: 100%;
      height: vw(80);
      border-radius: vw(80);
      @include border;
      .email {
        font-size: vw(24);
        padding-left: vw(32);
        padding-right: vw(200);
      }
      .submit {
        top: 0;
        right: 0;
        width: vw(200);
        height: vw(72);
        font-size: vw(28);
        border-radius: vw(72);
      }
    }
  }
  .copyright {
    height: auto;
    flex-direction: column;
    padding: vw(20) 0;
    font-size: vw(24);
    &::before {
      background: none;
      box-shadow: none;
    }
    div {
      margin-bottom: vw(20);
    }
    a {
      &::after {
        margin-left: vw(8);
        margin-right: vw(8);
      }
    }
  }
}
</style>
