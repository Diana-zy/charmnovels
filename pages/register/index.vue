<template>
  <main>
    <custom-header class="login-page" />
    <div class="m-header">
      <custom-link to="/login/" class="btn-back"><i class="icon-back"></i></custom-link>
      <div class="header-title">Register</div>
    </div>
    <div class="container">
      <div class="form-container">
        <i class="logo-login logo-margin"></i>
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
              @input="validatePassword"
            />
            <i
              class="icon-visible"
              :class="{ 'icon-invisible': showPassword }"
              @click="togglePasswordVisibility"
            ></i>
            <p v-if="passwordFormatError">{{ passwordFormatError }}</p>
          </div>

          <div class="form-item">
            <label for="password2">Confirm password</label>
            <input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              name="confirmPassword"
              placeholder="Enter password"
              autocomplete="off"
              @input="validateForm"
            />
            <i
              class="icon-visible"
              :class="{ 'icon-invisible': showPassword }"
              @click="togglePasswordVisibility"
            ></i>
            <p v-if="passwordConfirmError">{{ passwordConfirmError }}</p>
          </div>

          <div class="form-item form-item-code">
            <label for="code">Verification code</label>
            <input
              v-model="emailCode"
              type="text"
              name="code"
              placeholder="Enter Verification code"
              @input="validateForm"
            />
            <button
              class="send-email"
              :disabled="countdown > 0 || !emailValid"
              @click="sendVerificationCode"
            >
              {{ countdown > 0 ? `${countdown}s` : "Send Code" }}
            </button>
            <p v-if="globalError">{{ globalError }}</p>
          </div>

          <div class="form-item form-item-terms">
            <input
              v-model="agreement"
              type="checkbox"
              name="terms"
              class="btn-agreement"
              @change="validateForm"
            />
            <label for="terms" class="terms">
              I have read and agree to the
              <CustomLink to="/eula.html" target="_blank" class="link-terms"
                >Terms of Use</CustomLink
              >
              and
              <CustomLink to="/privacy.html" target="_blank" class="link-privacy"
                >Privacy Policy</CustomLink
              >.
            </label>
          </div>

          <button type="submit" class="btn-login" :disabled="!isFormValid"
            >Register and log in</button
          >
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
      emailCode: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      agreement: false,
      countdown: 0,
      emailError: "",
      passwordFormatError: "",
      passwordConfirmError: "",
      globalError: "",
      emailValid: false,
      isFormValid: false,
      loading: false
    };
  },
  methods: {
    validateEmail() {
      // 简单的邮箱格式校验
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.emailValid = emailPattern.test(this.email);
      if (!this.emailValid) {
        this.emailError = "Invalid email address";
      } else {
        this.emailError = "";
      }
      this.validateForm();
    },
    validatePassword() {
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;

      if (!passwordPattern.test(this.password)) {
        this.passwordFormatError = "6 to 18 digits and letters";
      } else {
        this.passwordFormatError = ""; // 清除错误信息
      }
    },
    validateForm() {
      // 校验表单有效性：邮箱有效、密码匹配且同意协议
      this.passwordConfirmError =
        this.password !== this.confirmPassword ? "Passwords do not match" : "";
      this.isFormValid =
        this.emailValid &&
        this.password !== "" &&
        this.password === this.confirmPassword &&
        this.agreement &&
        this.emailCode !== "";
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async sendVerificationCode() {
      if (this.emailValid && this.countdown === 0) {
        // 模拟发送验证码
        console.log("Sending verification code to", this.email);

        this.loading = true;
        try {
          const loginResponse = await this.$axios.$post("/api/user/get_code", {
            site_id: process.env.SITE_ID,
            email: this.email
          });
          console.log("Login response:", loginResponse);
          this.startCountdown();
        } catch (error) {
          console.log("Login error:", error.msg);
          this.globalError = error.msg || "Login error";
        }
        this.loading = false;
      }
    },
    startCountdown() {
      this.countdown = 60;
      const interval = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown === 0) {
          clearInterval(interval);
        }
      }, 1000);
    },
    handleSubmit() {
      this.validateForm();
      if (!this.isFormValid) {
        return;
      }
      console.log("Registering with", this.email, this.password, this.emailCode);
      this.register();
    },
    async register() {
      this.loading = true;

      try {
        const registerResponse = await this.$axios.$post("/api/user/signup", {
          site_id: process.env.SITE_ID,
          email: this.email,
          password: this.password,
          code: this.emailCode
        });
        console.log("Register response:", registerResponse);
        dataLayer.push({ event: "Register_successful" });
        Storage.setCookie("novel_token", registerResponse.token);
        Storage.setCookie("novel_userId", registerResponse.user_id);

        if (Storage.getCookie("novel_preLoginPath")) {
          const newHref = window.location.origin + Storage.getCookie("novel_preLoginPath");
          window.location.href = newHref;
        } else {
          simulateClick("/", "from", "register");
        }
      } catch (error) {
        console.log("Register error:", error.msg);
        this.globalError = error.msg || "Register error";
      }

      this.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/login.scss";
</style>
