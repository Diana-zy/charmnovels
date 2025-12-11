<template>
  <div ref="googleAdPreload" class="google-ad-parent">
    <p class="title">Advertisement</p>
    <ins
      class="adsbygoogle"
      style="display: block; height: 100%; width: 100%"
      data-ad-client="ca-pub-1853000876464912"
      :data-ad-slot="adSlot"
    ></ins>
    <script>
      (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
  </div>
</template>

<script>
export default {
  props: {
    adSlot: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  background: $color3;
  font-size: 12px;
  line-height: 24px;
  color: $color1;
  text-align: center;
}
@media screen and (max-width: 750px) {
  .google-ad-parent {
    height: vw(176);
    overflow: hidden;
  }
  .title {
    font-size: vw(24);
    line-height: vw(36);
  }
}
</style>
