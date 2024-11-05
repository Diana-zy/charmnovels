<template>
  <div ref="googleAdStyle">
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
  data() {
    return {
      observer: null
    };
  },
  mounted() {
    console.log("google-ad mounted", this.adSlot);
    this.observer = new IntersectionObserver(this.handleIntersection);
    this.observer.observe(this.$refs.googleAdStyle);
  },
  methods: {
    handleIntersection(entries) {
      console.log("google-adhandleIntersection", entries);
      if (entries[0].isIntersecting) {
        const adScript = document.createElement("script");
        adScript.innerHTML = `(adsbygoogle = window.adsbygoogle || []).push({});`;
        const ins = document.createElement("ins");
        ins.className = "adsbygoogle";
        ins.style.display = "block";
        ins.setAttribute("data-ad-client", "ca-pub-1853000876464912");
        ins.setAttribute("data-ad-slot", this.adSlot);
        ins.setAttribute("data-ad-format", "rectangle");
        ins.setAttribute("data-full-width-responsive", "true");
        this.$refs.googleAdStyle.appendChild(ins);
        this.$refs.googleAdStyle.appendChild(adScript);
        this.observer.unobserve(this.$refs.googleAdStyle);
      }
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
