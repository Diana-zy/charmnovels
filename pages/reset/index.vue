<template>
  <main>
    <custom-header class="login-page" />
    <div class="container">
      <div class="form-container">
        <i class="logo-login"></i>
        <h1 class="title black">Change Password</h1>

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

          <div class="form-item">
            <label for="password2">Confirm password</label>
            <input
              v-model="password2"
              type="password"
              name="password2"
              placeholder="Enter password"
            />
            <i class="icon-invisible"></i>
            <p>Please enter a valid email address</p>
          </div>

          <div class="form-item form-item-code">
            <label for="code">Verification code</label>
            <input v-model="code" type="text" name="code" placeholder="Enter Verification code" />
            <div class="send-email disabled">Send mail</div>
            <p>4-digit number</p>
          </div>

          <button type="submit" class="btn-login disabled">Modify and log in</button>
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
      password: "",
      password2: "",
      code: ""
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
