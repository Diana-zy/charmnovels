<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      timer: null
    };
  },
  mounted() {},
  methods: {
    // 显示激励广告
    showRewardedAd() {
      window.dataLayer.push({
        event: "Q_IR"
      });
      this.timer = setTimeout(() => {
        this.$emit("close-incentive-ad", false, true);
        clearTimeout(this.timer);
      }, 5000);
      try {
        // eslint-disable-next-line no-undef
        (adsbygoogle = window.adsbygoogle || []).push({
          params: {
            google_ad_loaded_callback: this.loadRewardedAd,
            google_ad_slot: 6875183545,
            google_ad_format: "rewarded"
          }
        });
      } catch (e) {
        this.$emit("close-incentive-ad", false);
      }
    },
    loadRewardedAd(rewardedAd) {
      this.$emit("close-incentive-ad", false);
      clearTimeout(this.timer);
      if (rewardedAd == null) {
        // 加载失败
        // this.showAdBreak();
        return;
      }
      rewardedAd.show((result) => {
        const closeStatus = result.status;
        if (closeStatus === "viewed") {
          // 用户观看了激励广告
          this.$emit("close-incentive-ad", true);
          window.trackEventToPixel("Watch_Ad_Completed");
          window.dataLayer.push({
            event: "V_IR"
          });
          this.$emit("viewed-ad");
        }
        // 用户关闭广告
        else if (closeStatus === "dismissed") {
          this.$emit("close-incentive-ad", false);
          window.dataLayer.push({
            event: "F_IR"
          });
        }
        // 广告异常关闭
        else {
          this.$emit("close-incentive-ad", false);
        }
      });
      // 展示激励广告
      window.dataLayer.push({
        event: "C_IR"
      });
    }
  }
};
</script>

<style scoped lang="scss"></style>
