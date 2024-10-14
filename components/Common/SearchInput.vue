<template>
  <section class="search-box">
    <input v-model="input" type="text" placeholder="Search" class="search-input" />
    <div class="search-btn" @click="submit"><i></i></div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      input: ""
    };
  },
  methods: {
    submit() {
      if (this.input.length < 2) {
        this.$globalMethod.showNotification({
          message: "Please enter at least 2 characters",
          type: "warning"
        });
        return;
      }
      this.$emit("handle-search", this.input);
    }
  }
};
</script>

<style scoped lang="scss">
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 320px;
  height: 40px;
  border-radius: 40px;
  border: 1px solid $color3;
}
.search-input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 0 97px 0 16px;
  color: $color2;
  font-size: 14px;
  &::placeholder {
    color: rgba($color2, 0.4);
  }
}
.search-btn {
  position: absolute;
  right: 0;
  width: 83px;
  height: 40px;
  border-radius: 40px;
  background: $color3;
  @include center;
  cursor: pointer;
  i {
    @include icon(24px, 24px, "s-icon-search.png");
  }
}
@media screen and (max-width: 750px) {
  .search-box {
    width: vw(400);
    height: vw(64);
    border-radius: vw(16);
  }
  .search-input {
    padding: 0 vw(124) 0 vw(24);
    font-size: vw(32);
  }
  .search-btn {
    width: vw(124);
    height: vw(64);
    border-radius: vw(16);
    i {
      width: vw(48);
      height: vw(48);
    }
  }
}
</style>
