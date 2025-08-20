<template>
  <div ref="admSlot" :class="['adm-slot', `adm-slot-${admId}`]">
    <p ref="title" class="title"
      >AD SHOW <span v-if="countdown" class="text-countdown">{{ countdown }}s</span></p
    >
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
    this.observer = new IntersectionObserver(this.handleIntersection);
    this.observer.observe(this.$refs.googleAdmSlot);
  },
  methods: {
    setCountDownInterval() {
      window.AD_SHOW_SCROLL_TOP = `adm-slot-${this.admId}`;
      window.AD_SHOW_SCROLL = false;
      const interval = setInterval(() => {
        this.countdown--;
        window.AD_SHOW_SCROLL = false;
        if (this.countdown === 0) {
          clearInterval(interval);
          window.AD_SHOW_SCROLL = true;
        }
      }, 1000);
    },
    handleIntersection(entries) {
      if (entries[0].isIntersecting) {
        this.setCountDownInterval();

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
