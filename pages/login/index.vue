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

          <button type="submit">Login</button>
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
  .title {
    font-family: "seb";
    font-size: 22px;
    line-height: 29px;
    color: $color3;
  }
  .logo-login {
    @include icon(120px, 120px, "logo-login.png");
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
}
</style>
