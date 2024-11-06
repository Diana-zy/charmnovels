<template>
  <div v-if="loading" id="fixed-bottom" class="fixed-bottom"></div>
</template>

<script>
export default {
  data() {
    return {
      loading: true
    };
  },
  mounted() {
    this.initializeLoading();
  },
  beforeDestroy() {
    this.cleanUp();
  },
  methods: {
    initializeLoading() {
      this.startLoadingTimeout();
      this.observeMutations();
    },
    startLoadingTimeout() {
      this.timer = setTimeout(() => {
        this.setLoading(false);
      }, 2600);
    },
    observeMutations() {
      this.mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.target.matches("ins.adsbygoogle") &&
            mutation.attributeName === "data-vignette-loaded"
          ) {
            this.setLoading(false);
          }
        });
      });

      this.mutationObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["data-vignette-loaded"]
      });
    },
    setLoading(status) {
      this.loading = status;
      if (!status) {
        this.cleanUp();
      }
    },
    cleanUp() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@media screen and (max-width: 750px) {
  .fixed-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: vw(112);
    z-index: 100001;
    background-color: transparent;
  }
}
</style>
