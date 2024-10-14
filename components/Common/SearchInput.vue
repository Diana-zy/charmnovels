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
  background: $color4;
  @include shadow-inner;
}
.search-input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 0 82px 0 16px;
  color: $color2;
  font-size: 14px;
  &::placeholder {
    color: rgba($color2, 0.4);
  }
}
.search-btn {
  position: absolute;
  right: 4px;
  width: 83px;
  height: 32px;
  border-radius: 32px;
  @include bg-theme;
  @include btn-shadow-outer;
  @include center;
  cursor: pointer;
  i {
    @include icon(24px, 24px, "s-icon-search.png");
  }
}
@media screen and (max-width: 750px) {
  .search-box {
    width: vw(562);
    height: vw(96);
    border-radius: vw(96);
    @include border;
    box-shadow: inset vw(12) vw(12) vw(24) 0 rgba(#235691, 0.16),
      inset vw(-12) vw(-12) vw(24) 0 $color1;
  }
  .search-input {
    padding: 0 vw(164) 0 vw(32);
    font-size: vw(32);
  }
  .search-btn {
    right: vw(4);
    width: vw(156);
    height: vw(80);
    border-radius: vw(80);
    box-shadow: none;
    i {
      width: vw(48);
      height: vw(48);
    }
  }
}
</style>
