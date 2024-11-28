<template>
  <div ref="googleAdStyle">
    <p ref="titleText" class="title">Advertisement</p>
  </div>
</template>

<script>
export default {
  props: {
    adSlot: {
      type: String,
      required: true
    },
    adType: {
      type: String,
      default: "page" // ["page", "inline", "info"];
    }
  },
  data() {
    return {
      observer: null
    };
  },
  mounted() {
    this.observer = new IntersectionObserver(this.handleIntersection);
    setTimeout(() => {
      this.observer.observe(this.$refs.googleAdStyle);
    }, 0);
  },
  methods: {
    handleIntersection(entries) {
      if (entries[0].isIntersecting) {
        const adScript = document.createElement("script");
        adScript.innerHTML = `(adsbygoogle = window.adsbygoogle || []).push({});`;
        const ins = document.createElement("ins");
        ins.className = "adsbygoogle";
        if (this.adType === "page") {
          ins.setAttribute("style", "display: block;");
          ins.setAttribute("data-ad-format", "rectangle");
          ins.setAttribute("data-full-width-responsive", "true");
        }
        if (this.adType === "inline") {
          ins.setAttribute("style", "display: block;width: 100%;height: 100%;text-align: center;");
          ins.setAttribute("data-ad-layout", "in-article");
          // ins.setAttribute("data-ad-format", "fluid");
          this.$refs.titleText.style.display = "none";
        }
        if (this.adType === "info") {
          ins.setAttribute("style", "display: block;");
          ins.setAttribute("data-ad-layout-key", "-i2-7+2w-11-86");
          ins.setAttribute("data-ad-format", "fluid");
        }
        ins.setAttribute("data-ad-client", "ca-pub-1853000876464912");
        ins.setAttribute("data-ad-slot", this.adSlot);

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
