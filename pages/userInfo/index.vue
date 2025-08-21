<template>
  <main>
    <custom-header class="login-page" />
    <div class="m-header">
      <custom-link class="btn-skip" to="/">
        <i class="icon-back"></i>
      </custom-link>
      <div class="header-title">CharmNovels</div>
    </div>
    <div class="container">
      <div class="form-container">
        <i class="logo-login"></i>
        <h1 class="title">Welcome to CharmNovels!</h1>
        <div class="list">
          <CustomLink to="/eula.html" target="_blank"> &lt;Terms of Service&gt; </CustomLink>
          <CustomLink to="/privacy.html" target="_blank"> &lt;Privacy Policy&gt; </CustomLink>
          <CustomLink to="/cookies.html" target="_blank"> &lt;Cookies Policy&gt; </CustomLink>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.login-page {
  ::v-deep .header-right {
    display: none !important;
  }
}
.container {
  max-width: 900px;
  width: calc(100% - 24px);
  background: #fffefc;
  box-shadow: 0px 0px 11px 0px rgba(0, 0, 0, 0.06);
  border-radius: 2px 2px 2px 2px;
  margin: 32px auto;
}
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 32px;
  .logo-login {
    @include icon(120px, 120px, "logo-login.png");
  }
  .title {
    font-family: "seb";
    font-size: 26px;
    line-height: 32px;
    color: $color3;
    margin: 12px 0 16px;
    font-weight: bold;
    &.black {
      color: $color2;
    }
  }

  .list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    margin: 24px 0;
    font-size: 24px;
    color: $color3;
  }
}
.m-header {
  display: none;
}

@media screen and (max-width: 750px) {
  .login-page {
    display: none;
  }
  .m-header {
    position: fixed;
    top: 0;
    background: #fffcf7;
    height: vw(96);
    width: 100%;
    @include center;
    .header-title {
      font-family: "seb";
      font-weight: bold;
      font-size: vw(36);
    }
    .btn-skip {
      position: absolute;
      left: vw(46);
      font-size: vw(28);
      font-family: "sesb";
      @include center;
    }
    .btn-back {
      position: absolute;
      left: vw(46);
      font-size: vw(28);
      font-family: "sesb";
      @include center;
    }
    .icon-back {
      @include icon(vw(48), vw(48), "icon-back.png");
    }
  }
  .container {
    max-width: 900px;
    width: calc(100% - vw(92));
    background: #fffcf7;
    box-shadow: none;
    border-radius: 0;
    margin: vw(32) auto vw(80);
  }
  .form-container {
    padding: 0;
    .logo-login {
      @include icon(vw(240), vw(240), "logo-login.png");
    }
    .title {
      font-size: vw(44);
      line-height: vw(58);
      margin: vw(24) 0 vw(32);
    }
    .list {
      gap: vw(32);
      margin: vw(46) 0;
      font-size: vw(36);
    }
  }
}
</style>
