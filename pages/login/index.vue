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

        <form class="form" @submit.prevent="handleLogin">
          <div class="form-item">
            <label for="email">Email</label>
            <input
              v-model="email"
              type="text"
              name="email"
              placeholder="Example@email.com"
              @input="validateEmail"
            />
            <p v-if="emailError">{{ emailError }}</p>
          </div>

          <div class="form-item">
            <label for="password">Password</label>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              name="password"
              placeholder="Enter password"
              @input="validateForm"
            />
            <i
              class="icon-visible"
              :class="{ 'icon-invisible': showPassword }"
              @click="togglePasswordVisibility"
            ></i>
            <p v-if="globalError">{{ globalError }}</p>
          </div>

          <button type="submit" :disabled="!isFormValid" class="btn-login">Login</button>
          <div class="line-or">—————————— or ——————————</div>
          <custom-link to="/register/" class="btn-register">Register</custom-link>
          <custom-link to="/reset/" class="reset">Forgot Password?</custom-link>
        </form>
      </div>
    </div>
    <common-notification />
    <common-loading v-if="loading" />
  </main>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      emailError: "",
      showPassword: false,
      globalError: "",
      isFormValid: false,
      loading: false
    };
  },
  methods: {
    validateEmail() {
      // 简单的邮箱格式校验
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        this.emailError = "Please enter a valid email address";
      } else {
        this.emailError = "";
      }
      this.validateForm();
    },
    validateForm() {
      // 表单有效性校验：邮箱格式正确且密码不为空
      this.isFormValid = this.emailError === "" && this.password !== "";
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      // 可以在这里处理表单提交的逻辑
      // 比如发起API请求
      console.log("Email:", this.email);
      console.log("Password:", this.password);

      this.loading = true;
      try {
        const loginResponse = await this.$axios.$post("/api/user/login", {
          site_id: process.env.SITE_ID,
          email: this.email,
          password: this.password
        });
        console.log("Login response:", loginResponse);
      } catch (error) {
        console.error("Login error:", error);
        this.globalError = "Invalid email or password";
      }
      this.registering = false;
      this.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/login.scss";
</style>
