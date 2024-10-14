<template>
  <custom-link :to="to" class="item">
    <nuxt-img
      format="auto"
      fit="cover"
      width="222"
      height="466"
      :src="item.mobile_img"
      :alt="item.name"
      class="cover"
      loading="lazy"
    />
  </custom-link>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    to: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 750px) {
  .item {
    position: relative;
    flex-shrink: 0;
    width: vw(248);
    height: vw(492);
    @include center;
    &::before {
      position: absolute;
      top: vw(-18);
      left: 50%;
      transform: translateX(-50%);
      content: "";
      display: block;
      @include icon(vw(312), vw(568), "mask-phone.png");
    }
    &::after {
      content: "12:59";
      position: absolute;
      top: vw(44);
      left: 50%;
      transform: translateX(-50%);
      color: $color1;
      font-size: vw(60);
      line-height: vw(80);
      text-shadow: 0 0 vw(12) rgba(#000, 0.35);
    }
  }
  .cover {
    width: vw(222);
    height: vw(466);
    border-radius: vw(14);
  }
}
</style>
