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
            <input v-model="agreement" type="checkbox" name="terms" @change="validateForm" />
            <label for="terms" class="terms">
              I accept the conditions of the
              <CustomLink to="/eula.html" target="_blank">Terms of Service</CustomLink>
              and agree to the processing of my personal data according to the
              <CustomLink to="/privacy.html" target="_blank">Privacy Policy</CustomLink>.
            </label>
          </div>

          <button type="submit" class="btn-login" :disabled="!isFormValid"
            >Register and log in</button
          >
        </form>
      </div>
    </div>
    <common-notification />
  </main>
</template>

<script>
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
      registering: false
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
    sendVerificationCode() {
      if (this.emailValid && this.countdown === 0) {
        // 模拟发送验证码
        console.log("Sending verification code to", this.email);
        this.startCountdown();
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
      if (!this.isFormValid && !this.registering) {
        return;
      }
      // 可以在这里处理表单提交的逻辑
      // 比如发起API请求
      console.log("Registering with", this.email, this.password, this.emailCode);
      this.register();
      // 假如是发送登录请求
      // this.$axios.post('/api/login', { email: this.email, password: this.password })
      //   .then(response => {
      //     // 处理响应
      //   })
      //   .catch(error => {
      //     // 处理错误
      //   });
    },
    async register() {
      this.registering = true;
      const registerResponse = await this.$axios.$post("/api/user/signup", {
        site_id: process.env.SITE_ID,
        email: this.email,
        password: this.password,
        code: this.emailCode
      });
      console.log("Register response:", registerResponse);
      this.registering = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/login.scss";
</style>
