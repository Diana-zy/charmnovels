<template>
  <main>
    <custom-header class="login-page" />
    <div class="m-header">
      <div class="header-title">Join or Login</div>
      <custom-link to="/" class="btn-skip">Skip<i class="icon-skip"></i></custom-link>
    </div>
    <div class="container">
      <div class="form-container">
        <i class="logo-login"></i>
        <h1 class="title">Welcome to CharmNovels!</h1>

        <form class="form" @submit.prevent="handleSubmit">
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
          <div class="line-or">—————————— or ——————————</div>
          <custom-link to="/register/" class="btn-register">Register</custom-link>
          <custom-link to="/reset/" class="reset">Forgot Password?</custom-link>
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
@import "@/assets/css/login.scss";
</style>
