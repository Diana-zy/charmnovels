<template>
  <main>
    <custom-header class="login-page" />
    <div class="m-header">
      <div class="header-title">Join or Login</div>
      <div class="btn-skip" @click="handleSkip">Skip<i class="icon-skip"></i></div>
    </div>
    <div class="container">
      <div class="form-container">
        <i class="logo-login"></i>
        <h1 class="title">Welcome to CharmNovels!</h1>

        <form class="form" @submit.prevent="handleSubmit">
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
              autocomplete="off"
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
    <common-loading-max v-if="loading" />
  </main>
</template>

<script>
import { simulateClick } from "~/utils/utils";
import Storage from "@/utils/storage";

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
    async handleSubmit() {
      this.loading = true;
      try {
        const loginResponse = await this.$axios.$post("/api/user/login", {
          site_id: process.env.SITE_ID,
          email: this.email,
          password: this.password
        });
        console.log("Login response:", loginResponse);

        Storage.setCookie("novel_token", loginResponse.token);
        Storage.setCookie("novel_userId", loginResponse.user_id);

        this.handleSkip();
      } catch (error) {
        console.log("Login error:", error.msg);
        this.globalError = error.msg || "Login error";
      }
      this.registering = false;
      this.loading = false;
    },
    handleSkip() {
      if (Storage.getCookie("novel_preLoginPath")) {
        const newHref = window.location.origin + Storage.getCookie("novel_preLoginPath");
        window.location.href = newHref;
      } else {
        simulateClick("/", "from", "login");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/login.scss";
</style>
