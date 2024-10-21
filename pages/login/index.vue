<template>
  <main>
    <custom-header />
    <div class="login-container">
      <div class="login-form-container">
        <i class="logo-login"></i>
        <h1 class="title">Welcome to CharmNovels!</h1>

        <form class="login-form" @submit.prevent="handleSubmit">
          <div class="form-item">
            <label for="email">Email</label>
            <input v-model="email" type="text" name="email" placeholder="Example@email.com" />
            <p>Please enter a valid email address</p>
          </div>

          <div class="form-item">
            <label for="password">Password</label>
            <input
              v-model="password"
              type="password"
              name="password"
              placeholder="Enter password"
            />
            <i class="icon-visible"></i>
            <p>Please enter a valid email address</p>
          </div>

          <button type="submit" class="btn-login">Login</button>
          <custom-link to="/register" class="register-link">Register</custom-link>
          <custom-link to="/reset" class="reset">Forgot Password?</custom-link>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    handleSubmit() {
      // 可以在这里处理表单提交的逻辑
      // 比如发起API请求
      console.log("Email:", this.email);
      console.log("Password:", this.password);

      // 假如是发送登录请求
      // this.$axios.post('/api/login', { email: this.email, password: this.password })
      //   .then(response => {
      //     // 处理响应
      //   })
      //   .catch(error => {
      //     // 处理错误
      //   });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  max-width: 900px;
  width: calc(100% - 24px);
  height: 620px;
  background: #fffefc;
  box-shadow: 0px 0px 11px 0px rgba(0, 0, 0, 0.06);
  border-radius: 2px 2px 2px 2px;
  margin: 32px auto;
}
.login-form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 32px 32px;
  .logo-login {
    @include icon(120px, 120px, "logo-login.png");
  }
  .title {
    font-family: "seb";
    font-size: 22px;
    line-height: 29px;
    color: $color3;
    margin: 12px 0 16px;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 329px;
  }
  .form-item {
    width: 100%;
    margin-bottom: 8px;
    position: relative;
  }
  input {
    width: 100%;
    height: 40px;
    border-radius: 8px 8px 8px 8px;
    border: 1px solid rgba(65, 65, 76, 0.4);
    padding: 0 10px;
    font-size: 14px;
    &::placeholder {
      color: rgba($color2, 0.4);
    }
  }
  p {
    font-size: 14px;
    color: #ff6b6b;
    line-height: 19px;
  }
  label {
    display: block;
    line-height: 21px;
    font-family: "seb";
    margin-bottom: 8px;
  }
  .icon-visible {
    @include icon(24px, 24px, "icon-visible.png");
    position: absolute;
    right: 10px;
    top: 37px;
    cursor: pointer;
  }
  .btn-login {
  }
}
</style>
