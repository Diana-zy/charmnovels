<template>
  <nav class="label-box">
    <i class="label-icon"></i>
    <div class="label-title">
      <CustomLink to="/">Home</CustomLink>
      <span>></span>
      <b class="active">{{ name }}</b>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: "Page"
    }
  }
};
</script>

<style lang="scss" scoped>
.label-box {
  width: max-content;
  height: 24px;
  margin: 32px 0;
  @include center;
}
.label-icon {
  @include icon(24px, 24px, "icon-breadcrumb.png");
  margin-right: 8px;
}
.label-title {
  font-size: 14px;
  color: rgba($color2, 0.6);
  @include center;
  span {
    margin: 0 8px;
  }
  .active {
    color: $color2;
    font-family: "sesb";
  }
}
@media screen and (max-width: 750px) {
  .label-box {
    display: none;
  }
}
</style>
