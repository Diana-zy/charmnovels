<template>
  <div ref="googleAdPreload">
    <p class="title">Advertisement</p>
  </div>
</template>

<script>
export default {
  props: {
    adSlot: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.handleIntersection();
  },
  methods: {
    handleIntersection() {
      const adScript = document.createElement("script");
      adScript.innerHTML = `(adsbygoogle = window.adsbygoogle || []).push({});`;
      const ins = document.createElement("ins");
      ins.className = "adsbygoogle";
      ins.style.display = "block";
      ins.setAttribute("data-ad-client", "ca-pub-1853000876464912");
      ins.setAttribute("data-ad-slot", this.adSlot);
      ins.setAttribute("data-ad-format", "rectangle");
      ins.setAttribute("data-full-width-responsive", "true");
      this.$refs.googleAdPreload.appendChild(ins);
      this.$refs.googleAdPreload.appendChild(adScript);
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
  .title {
    font-size: vw(24);
    line-height: vw(36);
  }
}
</style>
