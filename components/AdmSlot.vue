<template>
  <div ref="admSlot" :class="['adm-slot', `adm-slot-${admId}`]">
    <p ref="title" class="title">AD SHOW</p>
    <div :id="admId" ref="googleAdmSlot" class="ad-slot"></div>
  </div>
</template>

<script>
export default {
  props: {
    admId: {
      type: String,
      required: true
    },
    admUnit: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      countdown: 3
    };
  },
  mounted() {
    this.observer = new IntersectionObserver(this.handleIntersection, {
      rootMargin: `0px 0px ${innerHeight}px 0px`
    });
    this.observer.observe(this.$refs.googleAdmSlot);
  },
  methods: {
    handleIntersection(entries) {
      if (entries[0].isIntersecting) {
        const width = this.$refs.admSlot.clientWidth;
        const height = this.$refs.admSlot.clientHeight - this.$refs.title.clientHeight;
        console.log(width, height);
        const adScript = document.createElement("script");
        adScript.innerHTML = `googletag.cmd.push(function () {
              googletag.defineSlot('${this.admUnit}', ['fluid', [${width},${height}]], '${this.admId}').addService(googletag.pubads());
              googletag.enableServices();
              googletag.display('${this.admId}');
            });`;
        this.$refs.googleAdmSlot.appendChild(adScript);
        this.observer.unobserve(this.$refs.googleAdmSlot);
      }
    }
  }
};
</script>

<style lang="scss">
.adm-slot {
  width: 100%;
  height: 270px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.adm-slot .title {
  flex-shrink: 0;
  font-size: 12px;
  line-height: 20px;
  color: $color2;
  text-align: center;
  background: $color_fff;
}
.text-countdown {
  color: red;
}
@media screen and (max-width: 750px) {
  .adm-slot {
    height: vw(668);
  }
  .adm-slot .title {
    font-size: vw(24);
    line-height: vw(40);
  }
}
</style>
