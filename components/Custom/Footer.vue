<template>
  <footer>
    <div class="introduction">
      charmnovels.com is a wallpaper aggregation platform. Through this platform, you can download
      beautiful wallpapers on various devices that support Android and iOS. Our team’s goal is to
      help all users find wallpapers they love. <br />
      We offer a variety of wallpaper types, including but not limited to 3D dynamic, 4K ultra HD,
      anime animations, football stars, pink aesthetics, component parts, fluid effects, and
      personalized wallpapers. charmnovels.com has collected the hottest, most classic, and most
      interesting wallpapers, each carefully selected by us, along with collections to meet your
      needs. <br />
      charmnovels.com is a website that provides high-quality wallpaper options. The site does not
      offer downloads for wallpaper applications; the download links for wallpapers will redirect to
      official platforms like Google Play and the Apple Store. Users can quickly find the wallpapers
      that suit them best on charmnovels.com. <br />
      We hope you find wallpapers you love on the charmnovels.com platform. If you have any feedback
      for us, please feel free to contact us via email:
      <a href="mailto:Service@charmnovels.com">Service@charmnovels.com</a>
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
  </footer>
</template>

<script>
export default {
  methods: {}
};
</script>

<style lang="scss" scoped>
footer {
  padding: 16px 0 0;
  margin: 32px auto 0;
  box-sizing: content-box;
  border-top: 1px solid rgba($color2, 0.1);
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
      margin-left: 6px;
      margin-right: 6px;
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
    margin-top: vw(32);
  }
  .introduction {
    font-size: vw(24);
    line-height: vw(32);
    margin: vw(24) 0 0;
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
